<template>
  <q-dialog
    v-model="isOpen"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="product-dialog">
      <!-- Header -->
      <q-card-section class="row items-center bg-primary text-white">
        <div class="text-h6 q-mr-auto">
          <q-icon :name="isEdit ? 'edit' : 'add'" class="q-mr-sm" />
          {{ isEdit ? 'Editar Producto' : 'Nuevo Producto' }}
        </div>
        <q-btn icon="close" flat round dense @click="closeDialog" :disable="saving" />
      </q-card-section>
      <!-- Contenido -->
      <q-card-section>
        <q-form @submit="saveProduct" class="full-height" ref="formRef">
          <q-scroll-area style="height: calc(100vh - 135px)">
            <div class="q-py-sm">
              <div class="row">
                <!-- Columna izquierda  -->
                <div class="col-md-6 col-sm-12 q-px-sm">
                  <!-- Información básica -->
                  <q-card flat bordered class="q-pa-sm q-mb-md">
                    <q-card-section>
                      <div class="text-h6 text-primary q-px-xs q-mb-md">
                        <q-icon name="info" class="q-mr-sm" />
                        Información Básica
                      </div>

                      <div class="row q-gutter-y-md">
                        <div class="col-12 q-px-xs">
                          <q-input
                            v-model="form.name"
                            label="Nombre del Producto *"
                            outlined
                            :rules="[(val) => !!val || 'El nombre es requerido']"
                            :disable="saving"
                            counter
                            maxlength="255"
                            lazy-rules
                          >
                            <template v-slot:prepend>
                              <q-icon name="medical_services" />
                            </template>
                          </q-input>
                        </div>

                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-px-xs">
                          <q-input
                            v-model="form.code"
                            label="Código del Producto *"
                            outlined
                            :rules="[(val) => !!val || 'El código es requerido']"
                            :disable="saving"
                            counter
                            maxlength="50"
                            lazy-rules
                          >
                            <template v-slot:prepend>
                              <q-icon name="qr_code" />
                            </template>
                            <template v-slot:append>
                              <q-btn
                                icon="casino"
                                flat
                                round
                                size="sm"
                                @click="generateCode"
                                :disable="saving"
                              >
                                <q-tooltip>Generar código automático</q-tooltip>
                              </q-btn>
                            </template>
                          </q-input>
                        </div>

                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-px-xs">
                          <q-input
                            v-model="form.pharmaceutical_form"
                            label="Forma Farmacéutica *"
                            outlined
                            :rules="[(val) => !!val || 'La forma farmacéutica es requerida']"
                            :disable="saving"
                            lazy-rules
                            hint="Ej: forma farmacéutica"
                          >
                            <template v-slot:prepend>
                              <q-icon name="science" />
                            </template>
                          </q-input>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>

                  <!-- Categorización -->
                  <q-card flat bordered class="q-pa-sm q-mb-md">
                    <q-card-section>
                      <div class="text-h6 text-primary q-px-xs q-mb-md">
                        <q-icon name="category" class="q-mr-sm" />
                        Categorización
                      </div>

                      <div class="row q-gutter-y-md">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-px-xs">
                          <q-select
                            v-model="form.category_id"
                            :options="categoryOptions"
                            label="Categoría *"
                            outlined
                            emit-value
                            map-options
                            :rules="[(val) => !!val || 'La categoría es requerida']"
                            :disable="saving"
                            :loading="loadingCategories"
                            lazy-rules
                          >
                            <template v-slot:prepend>
                              <q-icon name="folder" />
                            </template>
                            <template v-slot:append>
                              <q-btn
                                icon="add"
                                flat
                                round
                                size="sm"
                                @click="openCategoryDialog"
                                :disable="saving"
                              >
                                <q-tooltip>Agregar nueva categoría</q-tooltip>
                              </q-btn>
                            </template>
                          </q-select>
                        </div>

                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-px-xs">
                          <q-select
                            v-model="form.lab_id"
                            :options="labOptions"
                            label="Laboratorio *"
                            outlined
                            emit-value
                            map-options
                            :rules="[(val) => !!val || 'El laboratorio es requerido']"
                            :disable="saving"
                            :loading="loadingLabs"
                            lazy-rules
                          >
                            <template v-slot:prepend>
                              <q-icon name="business" />
                            </template>
                          </q-select>
                        </div>

                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-px-xs">
                          <q-select
                            v-model="form.type_id"
                            :options="typeOptions"
                            label="Tipo de Producto *"
                            outlined
                            emit-value
                            map-options
                            :rules="[(val) => !!val || 'El tipo es requerido']"
                            :disable="saving"
                            lazy-rules
                          >
                            <template v-slot:prepend>
                              <q-icon name="label" />
                            </template>
                          </q-select>
                        </div>

                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-px-xs">
                          <q-select
                            v-model="form.presentation_id"
                            :options="presentationOptions"
                            label="Presentación *"
                            outlined
                            emit-value
                            map-options
                            :rules="[(val) => !!val || 'La presentación es requerida']"
                            :disable="saving"
                            lazy-rules
                          >
                            <template v-slot:prepend>
                              <q-icon name="inventory" />
                            </template>
                          </q-select>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>

                  <!-- Imagen del producto -->
                  <q-card flat bordered class="q-pa-sm q-mb-md">
                    <q-card-section>
                      <div class="text-h6 text-primary q-px-xs q-mb-md">
                        <q-icon name="image" class="q-mr-sm" />
                        Imagen del Producto
                      </div>

                      <div class="text-center">
                        <!-- Vista previa de la imagen -->
                        <div v-if="form.image || imagePreview" class="q-mb-md">
                          <q-img
                            :src="imagePreview || form.image"
                            style="height: 200px; width: 200px"
                            class="rounded-borders"
                            fit="cover"
                          >
                            <template v-slot:error>
                              <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                                <q-icon name="broken_image" size="50px" />
                              </div>
                            </template>
                          </q-img>
                        </div>

                        <!-- Placeholder cuando no hay imagen -->
                        <div v-else class="q-mb-md">
                          <div
                            class="bg-grey-3 rounded-borders flex flex-center"
                            style="height: 200px; width: 200px; margin: 0 auto"
                          >
                            <q-icon name="image" size="50px" color="grey-5" />
                          </div>
                        </div>

                        <!-- Botones para cargar imagen -->
                        <div class="row q-gutter-sm justify-center">
                          <q-btn
                            icon="upload"
                            label="Subir Imagen"
                            color="primary"
                            outline
                            @click="triggerImageUpload"
                            :disable="saving"
                          />

                          <q-btn
                            v-if="form.image || imagePreview"
                            icon="delete"
                            label="Eliminar"
                            color="negative"
                            outline
                            @click="removeImage"
                            :disable="saving"
                          />
                        </div>

                        <!-- Input oculto para cargar archivos -->
                        <input
                          ref="imageInput"
                          type="file"
                          accept="image/*"
                          style="display: none"
                          @change="handleImageUpload"
                        />
                      </div>
                    </q-card-section>
                  </q-card>
                </div>

                <!-- Columna derecha -->
                <div class="col-md-6 col-sm-12 q-px-sm">
                  <!-- Stock y precio -->
                  <q-card flat bordered class="q-pa-sm q-mb-md">
                    <q-card-section>
                      <div class="text-h6 text-primary q-px-xs q-mb-md">
                        <q-icon name="monetization_on" class="q-mr-sm" />
                        Stock y Precios
                      </div>

                      <div class="row q-gutter-y-md">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-px-xs">
                          <q-input
                            v-model.number="form.stock"
                            label="Stock Inicial *"
                            outlined
                            type="number"
                            min="0"
                            :rules="[
                              (val) =>
                                (val !== null && val !== undefined && val >= 0) ||
                                'El stock debe ser mayor o igual a 0',
                            ]"
                            :disable="saving"
                            lazy-rules
                          >
                            <template v-slot:prepend>
                              <q-icon name="inventory_2" />
                            </template>
                          </q-input>
                        </div>

                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-px-xs">
                          <q-input
                            v-model.number="form.price"
                            label="Precio (S/) *"
                            outlined
                            type="number"
                            step="0.01"
                            min="0"
                            :rules="[
                              (val) =>
                                (val !== null && val !== undefined && val > 0) ||
                                'El precio debe ser mayor a 0',
                            ]"
                            :disable="saving"
                            lazy-rules
                          >
                            <template v-slot:prepend>
                              <q-icon name="attach_money" />
                            </template>
                          </q-input>
                        </div>

                        <div class="col-12 q-px-xs">
                          <q-input
                            v-model.number="form.min_stock"
                            label="Stock Mínimo"
                            outlined
                            type="number"
                            min="0"
                            hint="Nivel mínimo para alertas de stock"
                            :disable="saving"
                          >
                            <template v-slot:prepend>
                              <q-icon name="warning" />
                            </template>
                          </q-input>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>

                  <!-- Información adicional -->
                  <q-card flat bordered class="q-pa-sm">
                    <q-card-section>
                      <div class="text-h6 text-primary q-px-xs q-mb-md">
                        <q-icon name="description" class="q-mr-sm" />
                        Información Adicional
                      </div>

                      <div class="row q-gutter-y-md">
                        <div class="col-12 q-px-xs">
                          <q-input
                            v-model="form.description"
                            label="Descripción"
                            outlined
                            type="textarea"
                            rows="4"
                            counter
                            maxlength="500"
                            hint="Descripción detallada del producto"
                            :disable="saving"
                          >
                            <template v-slot:prepend>
                              <q-icon name="notes" />
                            </template>
                          </q-input>
                        </div>

                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-px-xs">
                          <q-input
                            v-model="form.batch"
                            label="Número de Lote"
                            outlined
                            hint="Número de lote del producto"
                            :disable="saving"
                          >
                            <template v-slot:prepend>
                              <q-icon name="confirmation_number" />
                            </template>
                          </q-input>
                        </div>

                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-px-xs">
                          <q-input
                            v-model="form.expiration_date"
                            label="Fecha de Vencimiento"
                            outlined
                            type="date"
                            hint="Fecha de vencimiento del producto"
                            :disable="saving"
                          >
                            <template v-slot:prepend>
                              <q-icon name="event" />
                            </template>
                          </q-input>
                        </div>

                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-px-xs">
                          <q-input
                            v-model="form.manufacturing_date"
                            label="Fecha de Fabricación"
                            outlined
                            type="date"
                            hint="Fecha de fabricación del producto"
                            :disable="saving"
                          >
                            <template v-slot:prepend>
                              <q-icon name="precision_manufacturing" />
                            </template>
                          </q-input>
                        </div>

                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-px-xs">
                          <q-input
                            v-model="form.concentration"
                            label="Concentración"
                            outlined
                            hint="Ej: 500mg, 250ml, etc."
                            :disable="saving"
                          >
                            <template v-slot:prepend>
                              <q-icon name="opacity" />
                            </template>
                          </q-input>
                        </div>

                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-px-xs">
                          <q-select
                            v-model="form.storage_condition_id"
                            :options="storageOptions"
                            label="Condiciones de Almacenamiento"
                            outlined
                            emit-value
                            map-options
                            :disable="saving"
                          >
                            <template v-slot:prepend>
                              <q-icon name="ac_unit" />
                            </template>
                          </q-select>
                        </div>

                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-px-xs">
                          <q-select
                            v-model="form.status"
                            :options="statusOptions"
                            label="Estado del Producto *"
                            outlined
                            emit-value
                            map-options
                            :rules="[(val) => !!val || 'El estado es requerido']"
                            :disable="saving"
                            lazy-rules
                          >
                            <template v-slot:prepend>
                              <q-icon name="flag" />
                            </template>
                          </q-select>
                        </div>

                        <div class="col-12">
                          <q-checkbox
                            v-model="form.requires_prescription"
                            label="Requiere Receta Médica"
                            :disable="saving"
                          />
                        </div>

                        <div class="col-12">
                          <q-checkbox
                            v-model="form.is_controlled"
                            label="Medicamento Controlado"
                            :disable="saving"
                          />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>
          </q-scroll-area>

          <!-- Footer con botones -->
          <q-separator />
          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat label="Cancelar" @click="closeDialog" :disable="saving" class="q-mr-sm" />
            <q-btn
              type="submit"
              color="primary"
              :label="isEdit ? 'Actualizar Producto' : 'Crear Producto'"
              :loading="saving"
              unelevated
            >
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                {{ isEdit ? 'Actualizando...' : 'Creando...' }}
              </template>
            </q-btn>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick, onMounted, onBeforeMount } from 'vue';
import { useQuasar } from 'quasar';
import { resources } from '../api-resource/ApiResource';
import { Product } from '../interface/ProductInterfaces';
import { useFetchHttp } from '@composables/useFetchHttp';
import { IComboItem } from '@interfaces/IComboItem'; // Importa la interfaz
import { useComboStore } from '@stores/combos/comboStore';

// Props
interface Props {
  modelValue: boolean;
  product?: any;
  isEdit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  product: null,
});

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  saved: [];
}>();

// Composables
// Instancia el store de Pinia
const comboStore = useComboStore();
const { fetchHttpResource } = useFetchHttp();
const $q = useQuasar();

// Referencias
const imageInput = ref<HTMLInputElement>();
const formRef = ref();

// Estados reactivos
const saving = ref(false);
const loadingCategories = ref(false);
const loadingLabs = ref(false);
const imagePreview = ref('');

// Formulario con todos los campos requeridos
const form = ref<any>({
  name: '',
  code: '',
  category_id: null,
  lab_id: null,
  type_id: null,
  presentation_id: null,
  stock: 0,
  price: 0,
  min_stock: 5,
  image: '',
  pharmaceutical_form: '',
  description: '',
  batch: '',
  expiration_date: '',
  manufacturing_date: '',
  concentration: '',
  storage_condition_id: null,
  status: 'active',
  requires_prescription: false,
  is_controlled: false,
});

// Opciones para selects
const categoryOptions = ref<IComboItem[]>([]);

const labOptions = ref<IComboItem[]>([]);

const typeOptions = ref<IComboItem[]>([]);

const presentationOptions = ref<IComboItem[]>([]);

const storageOptions = ref<IComboItem[]>([]);

const statusOptions = ref<IComboItem[]>([]);

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Watchers
watch(
  () => props.product,
  (newProduct) => {
    if (newProduct && props.isEdit) {
      // Cargar datos del producto para edición
      form.value = {
        name: newProduct.name || '',
        code: newProduct.code || '',
        category_id: newProduct.category_id || null,
        lab_id: newProduct.lab_id || null,
        type_id: newProduct.type_id || null,
        presentation_id: newProduct.presentation_id || null,
        stock: newProduct.stock || 0,
        price: newProduct.price || 0,
        min_stock: newProduct.min_stock || 5,
        image: newProduct.image || '',
        pharmaceutical_form: newProduct.pharmaceutical_form || '',
        description: newProduct.description || '',
        batch: newProduct.batch || '',
        expiration_date: newProduct.expiration_date || '',
        manufacturing_date: newProduct.manufacturing_date || '',
        concentration: newProduct.concentration || '',
        storage_condition_id: newProduct.storage_condition_id || null,
        status: newProduct.status || 'active',
        requires_prescription: newProduct.requires_prescription || false,
        is_controlled: newProduct.is_controlled || false,
      };
      imagePreview.value = '';
    } else {
      // Resetear formulario para nuevo producto
      resetForm();
    }
  },
);

watch(isOpen, (newValue) => {
  if (!newValue) {
    // Limpiar cuando se cierra el dialog
    void nextTick(() => {
      resetForm();
    });
  }
});

// Métodos
const resetForm = () => {
  form.value = {
    name: '',
    code: '',
    category_id: null,
    lab_id: null,
    type_id: null,
    presentation_id: null,
    stock: 0,
    price: 0,
    min_stock: 5,
    image: '',
    pharmaceutical_form: '',
    description: '',
    batch: '',
    expiration_date: '',
    manufacturing_date: '',
    concentration: '',
    storage_condition_id: null,
    status: 'active',
    requires_prescription: false,
    is_controlled: false,
  };
  imagePreview.value = '';

  // Resetear validación del formulario
  if (formRef.value) {
    formRef.value.resetValidation();
  }
};

const generateCode = () => {
  // Generar código automático
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  form.value.code = `PRD${timestamp}${random}`;
};

const triggerImageUpload = () => {
  imageInput.value?.click();
};

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      $q.notify({
        type: 'negative',
        message: 'Por favor selecciona un archivo de imagen válido',
      });
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      $q.notify({
        type: 'negative',
        message: 'La imagen no debe superar los 5MB',
      });
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // En una aplicación real, aquí subirías la imagen al servidor
    // Por ahora solo simulamos
    void simulateImageUpload(file);
  }
};

const simulateImageUpload = async (file: File) => {
  try {
    $q.loading.show({
      message: 'Subiendo imagen...',
    });

    // Simular subida de imagen
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simular URL de imagen subida
    form.value.image = file; //`https://api.example.com/uploads/${Date.now()}-${file.name}`;

    $q.notify({
      type: 'positive',
      message: 'Imagen subida correctamente',
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al subir la imagen',
    });
  } finally {
    $q.loading.hide();
  }
};

const removeImage = () => {
  form.value.image = '';
  imagePreview.value = '';
  if (imageInput.value) {
    imageInput.value.value = '';
  }
};

const openCategoryDialog = () => {
  $q.dialog({
    title: 'Nueva Categoría',
    message: 'Ingresa el nombre de la nueva categoría:',
    prompt: {
      model: '',
      type: 'text',
    },
    cancel: true,
    persistent: true,
  }).onOk((categoryName: string) => {
    if (categoryName.trim()) {
      // Simular creación de categoría
      void createCategory(categoryName.trim());
    }
  });
};

const createCategory = async (name: string) => {
  try {
    $q.loading.show({ message: 'Creando categoría...' });

    // Simular API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newCategory = {
      label: name,
      value: categoryOptions.value.length + 1,
    };

    categoryOptions.value.push(newCategory);
    form.value.category_id = newCategory.value;

    $q.notify({
      type: 'positive',
      message: 'Categoría creada correctamente',
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al crear la categoría',
    });
  } finally {
    $q.loading.hide();
  }
};

const saveProduct = async () => {
  // Validar formulario antes de enviar
  const isValid = await formRef.value?.validate();

  if (!isValid) {
    $q.notify({
      type: 'negative',
      message: 'Por favor corrige los errores en el formulario',
    });
    return;
  }

  saving.value = true;

  try {
    let resource = resources.createProduct;

    // --- CAMBIOS CLAVE AQUÍ: Crear FormData ---
    const formData = new FormData();

    if (props.isEdit) {
      resource = resources.updateProduct;
      resource.paramsRoute = [props.product.id];
      formData.append('_method', 'PUT');
    }

    for (const key in form.value) {
      const value = form.value[key];

      // Excluir la imagen si es una URL existente (string)
      if (key === 'image') {
        // Si el valor es una instancia de File, significa que el usuario seleccionó una nueva imagen.
        if (value instanceof File) {
          formData.append(key, value, value.name);
        }
        // Si el valor es un string (URL existente) o nulo/indefinido, NO lo añadimos al FormData.
        // Esto le dice al backend que el campo 'image' no ha sido modificado.
        continue; // Pasa a la siguiente iteración del bucle
      }

      // Manejar booleanos
      if (key === 'requires_prescription' || key === 'is_controlled') {
        formData.append(key, value ? '1' : '0');
      } else if (value !== null && value !== undefined) {
        // Para todos los demás campos (no imagen, no booleanos específicos)
        // Asegúrate de que los arrays o objetos complejos (si los hubiera) se serialicen correctamente
        // Los objetos y arrays complejos se enviarán como '[object Object]' si no se stringifican.
        // Si tienes arrays o objetos anidados, necesitarás JSON.stringify(value) o aplanarlos.
        // Para valores simples, esto está bien:
        formData.append(key, value);
      }
    }

    // Asignar el FormData a resource.data
    resource.data = formData;

    const response = await fetchHttpResource(resource, true);

    if (!response.success) {
      throw new Error(response.message || 'Error desconocido al cargar datos.');
    }

    $q.notify({
      type: response.success ? 'positive' : 'negative',
      message: response.success
        ? props.isEdit
          ? 'Producto actualizado correctamente'
          : 'Producto creado correctamente'
        : response.message,
      actions: [
        {
          label: 'Ver',
          color: 'white',
          handler: () => {
            // Lógica para ver el producto
          },
        },
      ],
    });

    emit('saved');
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: props.isEdit ? 'Error al actualizar el producto' : 'Error al crear el producto',
    });
  } finally {
    saving.value = false;
  }
};

const closeDialog = () => {
  if (saving.value) return;

  // Verificar si hay cambios sin guardar
  const hasChanges = Object.keys(form.value).some((key) => {
    if (!props.product && !props.isEdit) {
      // Para nuevo producto, verificar si hay algún campo con valor
      const currentValue = form.value[key as keyof typeof form.value];
      if (key === 'stock' || key === 'price' || key === 'min_stock') {
        return currentValue !== 0 && currentValue !== 5;
      }
      if (key === 'status') {
        return currentValue !== 'active';
      }
      if (key === 'requires_prescription' || key === 'is_controlled') {
        return currentValue !== false;
      }
      return !!currentValue;
    }

    if (props.isEdit && props.product) {
      const currentValue = form.value[key as keyof typeof form.value];
      const originalValue = props.product[key];
      return currentValue !== originalValue;
    }

    return false;
  });

  if (hasChanges) {
    $q.dialog({
      title: 'Confirmar',
      message: '¿Estás seguro de cerrar? Se perderán los cambios no guardados.',
      cancel: true,
      persistent: true,
    }).onOk(() => {
      isOpen.value = false;
    });
  } else {
    isOpen.value = false;
  }
};

// Lifecycle
onBeforeMount(() => {
  console.log('Combos montados');
  categoryOptions.value = comboStore.getComboData('categories');
  labOptions.value = comboStore.getComboData('labs');
  typeOptions.value = comboStore.getComboData('productTypes');
  presentationOptions.value = comboStore.getComboData('productPresentations');
  storageOptions.value = comboStore.getComboData('storageConditions');
  statusOptions.value = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
    { label: 'Descontinuado', value: 'discontinued' },
    { label: 'Agotado', value: 'out_of_stock' },
  ];
});
</script>

<style lang="scss" scoped>
.product-dialog {
  .q-card__section--vert {
    padding: 8px;
  }
}

.q-scroll-area {
  .q-scrollarea__content {
    width: 100%;
  }
}

.q-img {
  border: 2px solid #e0e0e0;
}

// Responsive adjustments
@media (max-width: 768px) {
  .product-dialog {
    .q-card__section {
      padding: 8px;
    }
  }
}

// Gradientes para mejorar la apariencia
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-gradient-info {
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
}

.bg-gradient-success {
  background: linear-gradient(135deg, #55a3ff 0%, #003d82 100%);
}

.bg-gradient-warning {
  background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
}

.bg-gradient-accent {
  background: linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%);
}

.bg-gradient-secondary {
  background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
}
</style>
