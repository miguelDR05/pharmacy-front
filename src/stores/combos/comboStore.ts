// src/stores/comboStore.ts
// Store de Pinia para gestionar y centralizar los datos de combos de forma dinámica.

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { IComboItem } from '@interfaces/IComboItem'; // Importa la interfaz del ítem de combo

// Define el tipo para el objeto que almacenará todos los combos dinámicamente.
// La clave será el nombre del combo (ej. 'categories', 'labs') y el valor será un array de IComboItem.
type DynamicCombos = Record<string, IComboItem[]>;

export const useComboStore = defineStore('combo', () => {
  // --- Estado (State) ---
  // Una única variable reactiva para almacenar todos los combos dinámicamente.
  const combos = ref<DynamicCombos>({});

  // Opciones estáticas que no necesitan API (se pueden inicializar directamente)
  const statusOptions = ref<IComboItem[]>([
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
    { label: 'Descontinuado', value: 'discontinued' },
    { label: 'Agotado', value: 'out_of_stock' },
  ]);

  const error = ref<string | null>(null); // Todavía útil para errores generales del store si los hubiera.

  // --- Acciones (Actions) ---
  /**
   * Settea los datos para un combo específico.
   * @param key La clave del combo (ej. 'categories', 'labs').
   * @param data El array de IComboItem[] a almacenar para ese combo.
   */
  const setComboData = (key: string, data: IComboItem[]) => {
    combos.value[key] = data;
    console.log(`Combo '${key}' setteado en store con ${data.length} ítems.`);
  };

  /**
   * Resetea todos los combos dinámicos a un estado vacío.
   */
  const resetCombos = () => {
    combos.value = {}; // Vacía el objeto de combos
    error.value = null;
    console.log('Todos los combos dinámicos reseteados en el store.');
  };

  /**
   * Resetea un combo específico a un estado vacío.
   * @param key La clave del combo a resetear (ej. 'categories', 'labs').
   */
  const resetSpecificComboData = (key: string) => {
    if (combos.value[key]) {
      combos.value[key] = [];
      console.log(`Combo '${key}' reseteado a vacío.`);
    } else {
      console.warn(`Intento de resetear combo '${key}' que no existe.`);
    }
  };

  // --- Getters ---
  /**
   * Obtiene los datos de un combo específico.
   * @param key La clave del combo.
   * @returns Un array de IComboItem[] o un array vacío si el combo no existe.
   */
  const getComboData = computed(() => (key: string): IComboItem[] => {
    return combos.value[key] || [];
  });

  // Getter para opciones estáticas (se mantiene separado por su naturaleza)
  const getStatusOptions = computed(() => statusOptions.value);

  const getError = computed(() => error.value);

  // Retorna el estado, las acciones (setters) y los getters para ser usados en los componentes.
  return {
    // Estado (acceso directo al objeto de combos si lo necesitas, pero se recomienda el getter)
    combos,
    statusOptions,
    error,
    // Acciones (Setters)
    setComboData,
    resetCombos,
    resetSpecificComboData, // <-- Nueva acción para resetear un combo específico
    // Getters (para acceder a datos computados o reactivos)
    getComboData,
    getStatusOptions,
    getError,
  };
});
