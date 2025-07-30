<template>
  <q-page class="q-pa-md">
    <!-- Header con título y acciones -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h4 class="text-h4 text-weight-medium q-ma-none text-grey-8">
          <q-icon name="inventory_2" class="q-mr-sm text-primary" />
          Productos
        </h4>
        <p class="text-grey-6 q-mb-none">Gestión de inventario farmacéutico</p>
      </div>

      <div class="row q-gutter-sm">
        <q-btn
          v-if="hasPermission('products.create')"
          color="primary"
          icon="add"
          label="Nuevo Producto"
          @click="openCreateDialog"
          class="q-px-lg"
          unelevated
        />
        <q-btn
          v-if="selectedProducts.length > 0 && hasPermission('products.delete')"
          color="negative"
          icon="delete"
          :label="`Eliminar (${selectedProducts.length})`"
          @click="confirmMultipleDelete"
          outline
        />
        <q-btn icon="refresh" @click="loadProducts" flat round class="text-grey-6">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Filtros y búsqueda -->
    <q-card flat class="q-mb-md">
      <q-card-section class="q-pa-md">
        <div class="row q-gutter-md items-end">
          <div class="col-md-3 col-sm-6 col-xs-12">
            <q-input
              v-model="filters.search"
              label="Buscar productos"
              outlined
              dense
              clearable
              debounce="500"
              @update:model-value="loadProducts"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-md-2 col-sm-6 col-xs-12">
            <q-select
              v-model="filters.category_id"
              :options="categoryOptions"
              label="Categoría"
              outlined
              dense
              clearable
              emit-value
              map-options
              @update:model-value="loadProducts"
            />
          </div>

          <div class="col-md-2 col-sm-6 col-xs-12">
            <q-select
              v-model="filters.lab_id"
              :options="labOptions"
              label="Laboratorio"
              outlined
              dense
              clearable
              emit-value
              map-options
              @update:model-value="loadProducts"
            />
          </div>

          <div class="col-md-2 col-sm-6 col-xs-12">
            <q-select
              v-model="filters.stock_status"
              :options="stockStatusOptions"
              label="Estado Stock"
              outlined
              dense
              clearable
              emit-value
              map-options
              @update:model-value="loadProducts"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabla de productos -->
    <q-card flat>
      <q-table
        :rows="products"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        @request="onRequest"
        selection="multiple"
        v-model:selected="selectedProducts"
        :rows-per-page-options="[10, 25, 50, 100]"
        class="product-table"
      >
        <!-- Slot para el estado del stock -->
        <template v-slot:body-cell-stock="props">
          <q-td :props="props">
            <q-chip
              :color="getStockColor(props.value)"
              text-color="white"
              size="sm"
              :icon="getStockIcon(props.value)"
            >
              {{ props.value }}
            </q-chip>
          </q-td>
        </template>

        <!-- Slot para el precio -->
        <template v-slot:body-cell-price="props">
          <q-td :props="props">
            <span class="text-weight-medium text-green-8">
              S/ {{ parseFloat(props.value).toFixed(2) }}
            </span>
          </q-td>
        </template>

        <!-- Slot para la imagen -->
        <template v-slot:body-cell-image="props">
          <q-td :props="props">
            <q-avatar
              v-if="props.row.image"
              size="40px"
              rounded
              class="cursor-pointer"
              @click="showImageDialog(props.row.image)"
            >
              <img :src="props.row.image" :alt="props.row.name" />
            </q-avatar>
            <q-icon v-else name="image_not_supported" size="24px" color="grey-5" />
          </q-td>
        </template>

        <!-- Slot para el código -->
        <template v-slot:body-cell-code="props">
          <q-td :props="props">
            <q-chip
              outline
              color="primary"
              size="sm"
              clickable
              @click="copyToClipboard(props.value)"
            >
              {{ props.value }}
              <q-tooltip>Click para copiar</q-tooltip>
            </q-chip>
          </q-td>
        </template>

        <!-- Slot para las acciones -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="row q-gutter-xs">
              <q-btn
                v-if="hasPermission('products.view')"
                icon="visibility"
                size="sm"
                flat
                round
                color="info"
                @click="viewProduct(props.row)"
              >
                <q-tooltip>Ver detalles</q-tooltip>
              </q-btn>

              <q-btn
                v-if="hasPermission('products.edit')"
                icon="edit"
                size="sm"
                flat
                round
                color="warning"
                @click="editProduct(props.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>

              <q-btn
                v-if="hasPermission('products.delete')"
                icon="delete"
                size="sm"
                flat
                round
                color="negative"
                @click="confirmDelete(props.row)"
              >
                <q-tooltip>Eliminar</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>

        <!-- Slot cuando no hay datos -->
        <template v-slot:no-data="{ message }">
          <div class="full-width row flex-center text-grey-6 q-gutter-sm">
            <q-icon size="2em" name="inventory_2" />
            <span class="text-subtitle1">
              {{ message || 'No hay productos disponibles' }}
            </span>
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Dialog para crear/editar producto -->
    <ProductDialog
      v-model="showDialog"
      :product="selectedProduct"
      :is-edit="isEdit"
      @saved="onProductSaved"
    />

    <!-- Dialog para ver imagen -->
    <q-dialog v-model="showImagePreview">
      <q-card>
        <q-card-section class="text-center">
          <img
            :src="previewImage"
            class="img-responsive"
            style="max-height: 400px; max-width: 100%"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import ProductDialog from './components/Form.vue';
import { resources } from './api-resource/ApiResource';
import { Product } from './interface/ProductInterfaces';
import { useFetchHttp, IHttpResponse } from '@composables/useFetchHttp';
import { useCombo } from '@composables/useCombo'; // Importa tu nuevo composable
import { IComboItem } from '@interfaces/IComboItem'; // Importa la interfaz

interface TableColumn {
  name: string;
  label: string;
  field: string | ((row: any) => any);
  required?: boolean;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  format?: (val: any) => string;
  style?: string;
  headerStyle?: string;
}

// Define una interfaz para la estructura de los datos que esperas de 'observations'
interface ProductData {
  header: Array<{ name: string; label: string; field: string; visible: boolean }>;
  data: Array<any>; // O tipar esto más específicamente si conoces la estructura de cada observación
}

// Composables
const { loadComboData } = useCombo();
const { fetchHttpResource } = useFetchHttp();
const $q = useQuasar();

// Estados reactivos
// const products = ref<Product[]>([]);
const products = ref<any>([]);
const selectedProducts = ref<Product[]>([]);
const selectedProduct = ref<Product | null>(null);
const loading = ref(false);
const showDialog = ref(false);
const isEdit = ref(false);
const showImagePreview = ref(false);
const previewImage = ref('');

// Filtros
const filters = ref({
  search: '',
  category_id: null,
  lab_id: null,
  stock_status: null,
});

// Paginación
const pagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 25,
  rowsNumber: 0,
});

// Opciones para selects
const categoryOptions = ref<IComboItem[]>([]);
const labOptions = ref<IComboItem[]>([]);
const typeOptions = ref<IComboItem[]>([]);
const presentationOptions = ref<IComboItem[]>([]);
const storageOptions = ref<IComboItem[]>([]);
const statusOptions = ref<IComboItem[]>([]);

const stockStatusOptions = ref<IComboItem[]>([
  { label: 'En Stock', value: 'in_stock' },
  { label: 'Stock Bajo', value: 'low_stock' },
  { label: 'Sin Stock', value: 'out_of_stock' },
]);

// Columnas de la tabla
const columns: TableColumn[] = [
  {
    name: 'image',
    label: '',
    field: 'image',
    align: 'center',
    style: 'width: 60px',
  },
  {
    name: 'name',
    label: 'Producto',
    field: 'name',
    required: true,
    align: 'left',
    sortable: true,
  },
  {
    name: 'code',
    label: 'Código',
    field: 'code',
    align: 'center',
    sortable: true,
  },
  {
    name: 'category_name',
    label: 'Categoría',
    field: 'category_name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'lab_name',
    label: 'Laboratorio',
    field: 'lab_name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'pharmaceutical_form',
    label: 'Forma Farmacéutica',
    field: 'pharmaceutical_form',
    align: 'left',
  },
  {
    name: 'stock',
    label: 'Stock',
    field: 'stock',
    align: 'center',
    sortable: true,
  },
  {
    name: 'price',
    label: 'Precio',
    field: 'price',
    align: 'right',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    field: 'actions',
    align: 'center',
    style: 'width: 120px',
  },
];

// Computed
const userPermissions = computed(() => {
  // Simular permisos del usuario actual
  return ['products.view', 'products.create', 'products.edit', 'products.delete'];
});

// Métodos
const hasPermission = (permission: string): boolean => {
  return userPermissions.value.includes(permission);
};

// Función para cargar todos los combos
const loadAllCombos = async () => {
  try {
    // Carga las categorías
    categoryOptions.value = await loadComboData('categoriesCombo');
    console.log('Categorías cargadas:', categoryOptions.value);

    // Carga los laboratorios
    labOptions.value = await loadComboData('labsCombo');
    console.log('Laboratorios cargados:', labOptions.value);

    typeOptions.value = await loadComboData('productTypesCombo');
    console.log('Tipo de productos cargados:', labOptions.value);

    presentationOptions.value = await loadComboData('productPresentationsCombo');
    console.log('Presentacion de productos cargados:', labOptions.value);
  } catch (error) {
    // Los errores ya son notificados por useCombo, aquí solo puedes logear si necesitas
    console.error('Fallo al cargar uno o más combos:', error);
  }
};

const loadProducts = async () => {
  try {
    loading.value = true;

    const response: IHttpResponse<ProductData> = await fetchHttpResource<ProductData>(
      resources.allProduct,
      true,
    );

    console.log('response');
    console.log(response);

    if (!response.success) {
      throw new Error(response.message || 'Error desconocido al cargar datos.');
    }

    // columns.value = response.data.header.filter((e: any) => e.visible == true);
    products.value = response.data;
    // rows.value = response.data.data;
  } catch (error: any) {
    if (error instanceof Error) {
      console.error('Error al cargar datos:', error.message);
      $q.notify({
        type: 'negative',
        message: error.message || 'Error desconocido.',
      });
    } else {
      console.error('Error desconocido:', error);
      $q.notify({
        type: 'negative',
        message: 'Error inesperado.',
      });
    }
  } finally {
    loading.value = false;
  }
};

const onRequest = async (props: any) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;

  await loadProducts();
};

const openCreateDialog = () => {
  selectedProduct.value = null;
  isEdit.value = false;
  showDialog.value = true;
};

const editProduct = (product: Product) => {
  selectedProduct.value = { ...product };
  isEdit.value = true;
  showDialog.value = true;
};

const viewProduct = (product: Product) => {
  $q.dialog({
    title: 'Detalles del Producto',
    message: `
      <div class="q-pa-md">
        <div class="row q-gutter-md">
          <div class="col-12">
            <strong>Nombre:</strong> ${product.name}
          </div>
          <div class="col-6">
            <strong>Código:</strong> ${product.code}
          </div>
          <div class="col-6">
            <strong>Stock:</strong> ${product.stock}
          </div>
          <div class="col-6">
            <strong>Precio:</strong> S/ ${product.price}
          </div>
          <div class="col-6">
            <strong>Forma:</strong> ${product.pharmaceutical_form}
          </div>
        </div>
      </div>
    `,
    html: true,
    ok: 'Cerrar',
  });
};

const confirmDelete = (product: Product) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Estás seguro de eliminar el producto "${product.name}"?`,
    cancel: true,
    persistent: true,
    color: 'negative',
  }).onOk(() => {
    void deleteProduct(product.id);
  });
};

const confirmMultipleDelete = () => {
  // Ya no es una función async
  $q.dialog({
    title: 'Confirmar eliminación múltiple',
    message: `¿Estás seguro de eliminar ${selectedProducts.value.length} productos?`,
    cancel: true,
    persistent: true,
    color: 'negative',
  }).onOk(() => {
    // Esta sí sigue siendo async porque usa await
    void deleteMultipleProducts();
  });
};

const deleteProduct = async (id: number) => {
  try {
    await simulateApiCall(`/api/products/${id}`, { method: 'DELETE' });

    $q.notify({
      type: 'positive',
      message: 'Producto eliminado correctamente',
    });

    await loadProducts();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al eliminar producto',
    });
  }
};

const deleteMultipleProducts = async () => {
  try {
    const ids = selectedProducts.value.map((p) => p.id);
    await simulateApiCall('/api/products/bulk-delete', {
      method: 'DELETE',
      data: { ids },
    });

    $q.notify({
      type: 'positive',
      message: `${selectedProducts.value.length} productos eliminados`,
    });

    selectedProducts.value = [];
    await loadProducts();
  } catch (error: any) {
    console.log(error);
    $q.notify({
      type: 'negative',
      message: 'Error al eliminar productos',
    });
  }
};

const onProductSaved = async () => {
  showDialog.value = false;
  selectedProduct.value = null;
  await loadProducts();
};

const showImageDialog = (imageUrl: string) => {
  previewImage.value = imageUrl;
  showImagePreview.value = true;
};

const copyToClipboard = (text: string) => {
  void navigator.clipboard.writeText(text);
  $q.notify({
    type: 'positive',
    message: 'Código copiado al portapapeles',
    timeout: 1000,
  });
};

const getStockColor = (stock: number): string => {
  if (stock <= 0) return 'negative';
  if (stock <= 10) return 'warning';
  return 'positive';
};

const getStockIcon = (stock: number): string => {
  if (stock <= 0) return 'error';
  if (stock <= 10) return 'warning';
  return 'check_circle';
};

// Función para simular llamadas a API
const simulateApiCall = async (url: string, options: any = {}) => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Datos simulados
  const mockData = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      category_id: 1,
      category_name: 'Analgésicos',
      lab_id: 2,
      lab_name: 'Laboratorio B',
      type_id: 1,
      type_name: 'Genérico',
      presentation_id: 1,
      presentation_name: 'Tableta',
      stock: 100,
      price: 4.5,
      code: '123456',
      pharmaceutical_form: 'forma farmacéutica',
      image:
        'https://farmaciauniversalpe.vtexassets.com/arquivos/ids/156423/00908_1.jpg?v=638417260707800000',
    },
    {
      id: 2,
      name: 'Ibuprofeno 400mg',
      category_id: 1,
      category_name: 'Analgésicos',
      lab_id: 1,
      lab_name: 'Laboratorio A',
      type_id: 1,
      type_name: 'Genérico',
      presentation_id: 1,
      presentation_name: 'Tableta',
      stock: 5,
      price: 6.75,
      code: '789012',
      pharmaceutical_form: 'forma farmacéutica',
      image:
        'https://farmaciauniversalpe.vtexassets.com/arquivos/ids/159167/00890_1.jpg?v=638590981889170000',
    },
  ];

  return {
    data: mockData,
    total: mockData.length,
    current_page: 1,
    per_page: 25,
  };
};

// Lifecycle
onMounted(async () => {
  console.log('Productos montados');
  loading.value = true;
  await loadAllCombos();
  await loadProducts();
});
</script>

<style lang="scss" scoped>
.product-table {
  .q-table__top,
  .q-table__bottom {
    padding: 12px 16px;
  }

  .q-table tbody td {
    padding: 8px 16px;
  }

  .q-table thead th {
    padding: 12px 16px;
    font-weight: 600;
    color: #424242;
  }
}

.q-card {
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
}
</style>
