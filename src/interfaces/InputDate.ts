export interface InputDate {


    range: boolean;
    selected: {
        from: string,
        to: string,
    };
    label: string;
    disable: boolean;
    // file?: File | null; // Posible uso para subir archivos
}
