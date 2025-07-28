<template>
  <q-page>
    <div class="dashboard-container">
      <!-- Header del Dashboard -->
      <div class="dashboard-header">
        <div class="header-content">
          <div class="header-left">
            <h1 class="dashboard-title">Dashboard PharmaCare</h1>
            <p class="dashboard-subtitle">Panel de control principal</p>
          </div>
          <div class="header-right">
            <div class="date-info">
              <q-icon name="today" size="20px" color="primary" />
              <span>{{ currentDate }}</span>
            </div>
            <q-btn round color="primary" icon="refresh" @click="refreshData" :loading="loading" />
          </div>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-section">
        <div class="kpi-grid">
          <q-card v-for="kpi in kpis" :key="kpi.id" class="kpi-card" :class="`kpi-${kpi.type}`">
            <q-card-section class="kpi-content">
              <div class="kpi-icon">
                <q-icon :name="kpi.icon" size="32px" />
              </div>
              <div class="kpi-data">
                <div class="kpi-value">{{ kpi.value }}</div>
                <div class="kpi-label">{{ kpi.label }}</div>
                <div class="kpi-trend" :class="kpi.trend > 0 ? 'positive' : 'negative'">
                  <q-icon :name="kpi.trend > 0 ? 'trending_up' : 'trending_down'" size="16px" />
                  {{ Math.abs(kpi.trend) }}%
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <div class="charts-grid">
          <!-- Ventas del Mes -->
          <q-card class="chart-card large-chart">
            <q-card-section class="chart-header">
              <div class="chart-title">
                <q-icon name="trending_up" color="primary" size="24px" />
                <h3>Ventas del Mes</h3>
              </div>
              <q-btn-dropdown flat icon="more_vert" dropdown-icon="none" size="sm">
                <q-list dense>
                  <q-item clickable @click="exportChart('sales')">
                    <q-item-section avatar>
                      <q-icon name="download" size="18px" />
                    </q-item-section>
                    <q-item-section>Exportar</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-card-section>
            <q-card-section class="chart-content">
              <highcharts :options="salesChartOptions" ref="salesChart" class="chart" />
            </q-card-section>
          </q-card>

          <!-- Top Productos -->
          <q-card class="chart-card">
            <q-card-section class="chart-header">
              <div class="chart-title">
                <q-icon name="medication" color="accent" size="24px" />
                <h3>Productos Más Vendidos</h3>
              </div>
            </q-card-section>
            <q-card-section class="chart-content">
              <highcharts :options="topProductsChartOptions" ref="topProductsChart" class="chart" />
            </q-card-section>
          </q-card>

          <!-- Inventario por Categoría -->
          <q-card class="chart-card">
            <q-card-section class="chart-header">
              <div class="chart-title">
                <q-icon name="inventory" color="secondary" size="24px" />
                <h3>Inventario por Categoría</h3>
              </div>
            </q-card-section>
            <q-card-section class="chart-content">
              <highcharts :options="inventoryChartOptions" ref="inventoryChart" class="chart" />
            </q-card-section>
          </q-card>

          <!-- Flujo de Caja -->
          <q-card class="chart-card">
            <q-card-section class="chart-header">
              <div class="chart-title">
                <q-icon name="account_balance_wallet" color="positive" size="24px" />
                <h3>Flujo de Caja Semanal</h3>
              </div>
            </q-card-section>
            <q-card-section class="chart-content">
              <highcharts :options="cashFlowChartOptions" ref="cashFlowChart" class="chart" />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Tables Section -->
      <div class="tables-section">
        <div class="tables-grid">
          <!-- Últimas Ventas -->
          <q-card class="table-card">
            <q-card-section class="table-header">
              <div class="table-title">
                <q-icon name="receipt_long" color="primary" size="24px" />
                <h3>Últimas Ventas</h3>
              </div>
              <q-btn flat icon="visibility" label="Ver todas" color="primary" size="sm" no-caps />
            </q-card-section>
            <q-card-section class="table-content">
              <q-table
                :rows="recentSales"
                :columns="salesColumns"
                row-key="id"
                flat
                hide-pagination
                :rows-per-page-options="[0]"
                class="modern-table"
              >
                <template v-slot:body-cell-status="props">
                  <q-td :props="props">
                    <q-chip :color="getStatusColor(props.value)" text-color="white" dense size="sm">
                      {{ props.value }}
                    </q-chip>
                  </q-td>
                </template>
                <template v-slot:body-cell-total="props">
                  <q-td :props="props">
                    <span class="amount">S/ {{ props.value.toFixed(2) }}</span>
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>

          <!-- Stock Bajo -->
          <q-card class="table-card">
            <q-card-section class="table-header">
              <div class="table-title">
                <q-icon name="warning" color="warning" size="24px" />
                <h3>Productos con Stock Bajo</h3>
              </div>
              <q-btn
                flat
                icon="shopping_cart"
                label="Reabastecer"
                color="warning"
                size="sm"
                no-caps
              />
            </q-card-section>
            <q-card-section class="table-content">
              <q-table
                :rows="lowStockProducts"
                :columns="stockColumns"
                row-key="id"
                flat
                hide-pagination
                :rows-per-page-options="[0]"
                class="modern-table"
              >
                <template v-slot:body-cell-stock="props">
                  <q-td :props="props">
                    <div class="stock-indicator">
                      <q-linear-progress
                        :value="props.value / 100"
                        :color="
                          props.value < 20 ? 'negative' : props.value < 50 ? 'warning' : 'positive'
                        "
                        size="8px"
                        rounded
                      />
                      <span class="stock-text">{{ props.value }} unidades</span>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn
                      round
                      flat
                      icon="add_shopping_cart"
                      color="primary"
                      size="sm"
                      @click="reorderProduct(props.row)"
                    />
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <q-card class="actions-card">
          <q-card-section class="actions-header">
            <h3>Acciones Rápidas</h3>
          </q-card-section>
          <q-card-section class="actions-content">
            <div class="actions-grid">
              <q-btn
                v-for="action in quickActions"
                :key="action.id"
                :icon="action.icon"
                :label="action.label"
                :color="action.color"
                unelevated
                no-caps
                class="action-btn"
                @click="executeAction(action.id)"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Notify } from 'quasar';
import Highcharts from 'highcharts';

// Interfaces
interface KPI {
  id: string;
  label: string;
  value: string;
  icon: string;
  trend: number;
  type: string;
}

interface Sale {
  id: string;
  cliente: string;
  productos: number;
  total: number;
  fecha: string;
  status: string;
}

interface Product {
  id: string;
  nombre: string;
  categoria: string;
  stock: number;
  precio: number;
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
}

// Reactive data
const loading = ref(false);
const currentDate = ref(
  new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
);

// KPIs
const kpis = ref<KPI[]>([
  {
    id: '1',
    label: 'Ventas Hoy',
    value: 'S/ 3,250.00',
    icon: 'point_of_sale',
    trend: 12.5,
    type: 'sales',
  },
  {
    id: '2',
    label: 'Productos Vendidos',
    value: '147',
    icon: 'medication',
    trend: 8.3,
    type: 'products',
  },
  {
    id: '3',
    label: 'Clientes Atendidos',
    value: '89',
    icon: 'people',
    trend: -2.1,
    type: 'clients',
  },
  {
    id: '4',
    label: 'Productos en Stock',
    value: '1,234',
    icon: 'inventory',
    trend: 5.7,
    type: 'inventory',
  },
  {
    id: '5',
    label: 'Ingresos del Mes',
    value: 'S/ 89,450.00',
    icon: 'account_balance_wallet',
    trend: 15.2,
    type: 'revenue',
  },
  {
    id: '6',
    label: 'Productos por Vencer',
    value: '23',
    icon: 'event_busy',
    trend: -18.5,
    type: 'expiring',
  },
]);

// Chart Options
const salesChartOptions = ref({
  chart: {
    type: 'line',
    height: 300,
    backgroundColor: 'transparent',
  },
  title: {
    text: null,
  },
  credits: {
    enabled: false,
  },
  xAxis: {
    categories: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    gridLineWidth: 1,
    gridLineColor: '#f0f0f0',
  },
  yAxis: {
    title: {
      text: 'Ventas (S/)',
    },
    gridLineColor: '#f0f0f0',
  },
  colors: ['#00B4A6', '#FF6B6B'],
  series: [
    {
      name: 'Ventas',
      data: [12500, 18900, 22300, 28700],
      lineWidth: 3,
      marker: {
        radius: 5,
      },
    },
    {
      name: 'Meta',
      data: [15000, 20000, 25000, 30000],
      lineWidth: 2,
      dashStyle: 'dash',
    },
  ],
  plotOptions: {
    line: {
      dataLabels: {
        enabled: true,
        format: 'S/ {y}',
      },
    },
  },
});

const topProductsChartOptions = ref({
  chart: {
    type: 'bar',
    height: 300,
    backgroundColor: 'transparent',
  },
  title: {
    text: null,
  },
  credits: {
    enabled: false,
  },
  xAxis: {
    categories: ['Paracetamol', 'Ibuprofeno', 'Amoxicilina', 'Aspirina', 'Omeprazol'],
  },
  yAxis: {
    title: {
      text: 'Unidades Vendidas',
    },
  },
  colors: ['#FF9500'],
  series: [
    {
      name: 'Ventas',
      data: [89, 76, 65, 58, 47],
      dataLabels: {
        enabled: true,
      },
    },
  ],
});

const inventoryChartOptions = ref({
  chart: {
    type: 'pie',
    height: 300,
    backgroundColor: 'transparent',
  },
  title: {
    text: null,
  },
  credits: {
    enabled: false,
  },
  colors: ['#00B4A6', '#FF6B6B', '#FF9500', '#6C5CE7', '#A0D911'],
  series: [
    {
      name: 'Productos',
      data: [
        { name: 'Analgésicos', y: 35 },
        { name: 'Antibióticos', y: 25 },
        { name: 'Vitaminas', y: 20 },
        { name: 'Digestivos', y: 12 },
        { name: 'Otros', y: 8 },
      ],
      dataLabels: {
        enabled: true,
        format: '{point.name}: {point.percentage:.1f}%',
      },
    },
  ],
});

const cashFlowChartOptions = ref({
  chart: {
    type: 'column',
    height: 300,
    backgroundColor: 'transparent',
  },
  title: {
    text: null,
  },
  credits: {
    enabled: false,
  },
  xAxis: {
    categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  },
  yAxis: {
    title: {
      text: 'Monto (S/)',
    },
  },
  colors: ['#52C41A', '#FF4D4F'],
  series: [
    {
      name: 'Ingresos',
      data: [2100, 1800, 2400, 2000, 2800, 3200, 1500],
    },
    {
      name: 'Gastos',
      data: [800, 600, 900, 700, 1100, 1200, 500],
    },
  ],
});

// Tables data
const salesColumns = ref<any>([
  { name: 'cliente', label: 'Cliente', field: 'cliente', align: 'left' },
  { name: 'productos', label: 'Productos', field: 'productos', align: 'center' },
  { name: 'total', label: 'Total', field: 'total', align: 'right' },
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'center' },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' },
]);

const recentSales = ref<Sale[]>([
  {
    id: '1',
    cliente: 'María González',
    productos: 3,
    total: 85.5,
    fecha: '27/07/2025 14:30',
    status: 'Completada',
  },
  {
    id: '2',
    cliente: 'Carlos Ruiz',
    productos: 1,
    total: 25.0,
    fecha: '27/07/2025 14:15',
    status: 'Completada',
  },
  {
    id: '3',
    cliente: 'Ana Flores',
    productos: 5,
    total: 125.75,
    fecha: '27/07/2025 13:45',
    status: 'Pendiente',
  },
  {
    id: '4',
    cliente: 'Luis Mendoza',
    productos: 2,
    total: 45.2,
    fecha: '27/07/2025 13:20',
    status: 'Completada',
  },
  {
    id: '5',
    cliente: 'Patricia Silva',
    productos: 4,
    total: 98.3,
    fecha: '27/07/2025 12:55',
    status: 'Completada',
  },
]);

const stockColumns = ref<any>([
  { name: 'nombre', label: 'Producto', field: 'nombre', align: 'left' },
  { name: 'categoria', label: 'Categoría', field: 'categoria', align: 'left' },
  { name: 'stock', label: 'Stock', field: 'stock', align: 'center' },
  { name: 'precio', label: 'Precio', field: 'precio', align: 'right' },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' },
]);

const lowStockProducts = ref<Product[]>([
  {
    id: '1',
    nombre: 'Paracetamol 500mg',
    categoria: 'Analgésicos',
    stock: 15,
    precio: 12.5,
  },
  {
    id: '2',
    nombre: 'Amoxicilina 250mg',
    categoria: 'Antibióticos',
    stock: 8,
    precio: 35.0,
  },
  {
    id: '3',
    nombre: 'Vitamina C 1000mg',
    categoria: 'Vitaminas',
    stock: 22,
    precio: 18.75,
  },
  {
    id: '4',
    nombre: 'Omeprazol 20mg',
    categoria: 'Digestivos',
    stock: 12,
    precio: 28.9,
  },
  {
    id: '5',
    nombre: 'Ibuprofeno 400mg',
    categoria: 'Analgésicos',
    stock: 6,
    precio: 15.6,
  },
]);

// Quick Actions
const quickActions = ref<QuickAction[]>([
  { id: 'new-sale', label: 'Nueva Venta', icon: 'add_shopping_cart', color: 'primary' },
  { id: 'add-product', label: 'Agregar Producto', icon: 'add_circle', color: 'secondary' },
  { id: 'inventory', label: 'Ver Inventario', icon: 'inventory', color: 'accent' },
  { id: 'reports', label: 'Reportes', icon: 'assessment', color: 'positive' },
  { id: 'clients', label: 'Gestionar Clientes', icon: 'people', color: 'info' },
  { id: 'settings', label: 'Configuración', icon: 'settings', color: 'grey-7' },
]);

// Methods
const refreshData = async () => {
  loading.value = true;
  try {
    // Simular carga de datos
    await new Promise((resolve) => setTimeout(resolve, 1500));

    Notify.create({
      type: 'positive',
      message: 'Datos actualizados correctamente',
      position: 'top-right',
    });
  } catch (error: any) {
    console.log(error);
    Notify.create({
      type: 'negative',
      message: 'Error al actualizar los datos',
      position: 'top-right',
    });
  } finally {
    loading.value = false;
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Completada':
      return 'positive';
    case 'Pendiente':
      return 'warning';
    case 'Cancelada':
      return 'negative';
    default:
      return 'grey';
  }
};

const reorderProduct = (product: Product) => {
  Notify.create({
    type: 'info',
    message: `Reabasteciendo ${product.nombre}...`,
    position: 'top-right',
  });
};

const executeAction = (actionId: string) => {
  Notify.create({
    type: 'info',
    message: `Ejecutando: ${quickActions.value.find((a) => a.id === actionId)?.label}`,
    position: 'top-right',
  });
};

const exportChart = (chartType: string) => {
  Notify.create({
    type: 'info',
    message: 'Exportando gráfico...',
    position: 'top-right',
  });
};

onMounted(() => {
  console.log('Dashboard PharmaCare cargado');
});
</script>

<style lang="scss" scoped>
// Variables

.dashboard-container {
  padding: 24px;
  background-color: $light-bg;
  min-height: 100vh;
}

// Header
.dashboard-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: $white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid $border-color;
}

.header-left {
  .dashboard-title {
    font-size: 32px;
    font-weight: 700;
    color: $text-primary;
    margin: 0 0 4px;
    letter-spacing: -0.02em;
  }

  .dashboard-subtitle {
    color: $text-secondary;
    font-size: 16px;
    margin: 0;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;

  .date-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: $secondary-color;
    border-radius: 12px;
    color: $text-primary;
    font-weight: 500;
  }
}

// KPI Section
.kpi-section {
  margin-bottom: 32px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.kpi-card {
  border-radius: 16px;
  border: 1px solid $border-color;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, $primary-color, $accent-color);
  }

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.kpi-content {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
}

.kpi-icon {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, $primary-color, lighten($primary-color, 10%));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $white;
}

.kpi-data {
  flex: 1;

  .kpi-value {
    font-size: 28px;
    font-weight: 700;
    color: $text-primary;
    line-height: 1;
    margin-bottom: 4px;
  }

  .kpi-label {
    font-size: 14px;
    color: $text-secondary;
    margin-bottom: 8px;
  }

  .kpi-trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-weight: 600;

    &.positive {
      color: #52c41a;
    }

    &.negative {
      color: #ff4d4f;
    }
  }
}

// Charts Section
.charts-section {
  margin-bottom: 32px;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;

  .large-chart {
    grid-column: span 2;
  }
}

.chart-card {
  border-radius: 16px;
  border: 1px solid $border-color;
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 0;
  border-bottom: 1px solid $border-color;

  .chart-title {
    display: flex;
    align-items: center;
    gap: 12px;

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: $text-primary;
      margin: 0;
    }
  }
}

.chart-content {
  padding: 0;

  .chart {
    min-height: 300px;
  }
}

// Tables Section
.tables-section {
  margin-bottom: 32px;
}

.tables-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.table-card {
  border-radius: 16px;
  border: 1px solid $border-color;
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid $border-color;
  background: lighten($light-bg, 2%);

  .table-title {
    display: flex;
    align-items: center;
    gap: 12px;

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: $text-primary;
      margin: 0;
    }
  }
}

.table-content {
  padding: 0;
}

.modern-table {
  :deep(.q-table__top) {
    display: none;
  }

  :deep(.q-table thead th) {
    background-color: lighten($light-bg, 2%);
    color: $text-primary;
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  :deep(.q-table tbody tr:hover) {
    background-color: $secondary-color;
  }

  :deep(.q-table tbody td) {
    padding: 16px 12px;
    border-bottom: 1px solid lighten($border-color, 50%);
  }
}

.amount {
  font-weight: 600;
  color: $primary-color;
}

.stock-indicator {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .stock-text {
    font-size: 12px;
    color: $text-secondary;
  }
}

// Quick Actions
.quick-actions {
  .actions-card {
    border-radius: 16px;
    border: 1px solid $border-color;
  }

  .actions-header {
    padding: 20px 24px 0;
    border-bottom: 1px solid $border-color;

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: $text-primary;
      margin: 0;
    }
  }

  .actions-content {
    padding: 24px;
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .action-btn {
    height: 56px;
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    }
  }
}

// Responsive Design
@media (max-width: 1200px) {
  .charts-grid {
    .large-chart {
      grid-column: span 1;
    }
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
    padding: 20px;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .charts-grid {
    grid-template-columns: 1fr;

    .large-chart {
      grid-column: span 1;
    }
  }

  .tables-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-content .chart {
    min-height: 250px;
  }
}

@media (max-width: 480px) {
  .kpi-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-title {
    font-size: 24px !important;
  }
}
</style>
