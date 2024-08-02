export interface User {
    user_code: string,
    user_name: string,
    user_password: string,
    user_email: string
}

export interface Selector {
    label     : string;
    value     : any;
}

export interface Field {
    type          : string;
    label         : string;
    name          : string;
    options?      : Selector[];
    required?     : boolean;
    disabled?     : boolean;
    onChange?     : () => void;
    validators?   : any[];
    defaultValue? : any;
}

export interface TercerElement {
    seqno       : number;
    terType?    : string;
    codigo      : string;
    nombre      : string;
    nomaux      : string;
    ciftyp      : string;
    cif         : string;
    estado      : string;
    coment      : string;
}

export interface DireccElement {
    codigo  : string;
    tipdir  : number;
    nomdir  : string;
    direcc  : string;
    telef1  : string;
}

export interface DirecTercero {
    tipdir: any;
    coddep: string;
    codprv: string;
    coddis: string;
    direcc: string;
    contac: string;
    telef1: string;
    email : string;
}

export const arrTypeUser: Selector[] = [
    { label: 'Usuario',         value: 'C' },
    { label: 'Empresa',         value: 'E' },
    { label: 'Transportista',   value: 'T' },
];

export const arrTypeCif: Selector[] = [
    { label: 'RUC',         value: '0' },
    { label: 'DNI',         value: '1' },
    { label: 'Carnet Extranjería',  value: '2' },
];

export const arrTypeStatus: Selector[] = [
    { label: 'Activo',      value: 'A' },
    { label: 'Inactivo',    value: 'I' },
];

