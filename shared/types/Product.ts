export interface Product {
    id: string;
    title: string;
    description: string;
    tags: string[];
    options: Option[];
    variants: Variant[];
    images: Image[];
    created_at: string;
    updated_at: string;
    visible: boolean;
    is_locked: boolean;
    external: External;
    blueprint_id: number;
    user_id: number;
    shop_id: number;
    print_provider_id: number;
    print_areas: PrintArea[];
    print_details: any[]; // Define if necessary
    sales_channel_properties: SalesChannelProperties;
    is_printify_express_eligible: boolean;
    is_printify_express_enabled: boolean;
    is_economy_shipping_eligible: boolean;
    is_economy_shipping_enabled: boolean;
    is_deleted: boolean;
    original_product_id: string;
    views: View[];
  }
  
  export interface Option {
    name: string;
    type: string;
    values: OptionValue[];
    display_in_preview: boolean;
  }
  
  export interface OptionValue {
    id: number;
    title: string;
    colors?: string[]; // Optional for options like "Sizes" that don't have colors
  }
  
  export interface Variant {
    id: number;
    sku: string;
    cost: number;
    price: number;
    title: string;
    grams: number;
    is_enabled: boolean;
    is_default: boolean;
    is_available: boolean;
    is_printify_express_eligible: boolean;
    options: number[];
    quantity: number;
  }
  
  export interface Image {
    src: string;
    variant_ids: number[];
    position: string;
    is_default: boolean;
    is_selected_for_publishing: boolean;
    order: number | null;
  }
  
  export interface External {
    id: string;
    handle: string;
    shipping_template_id: string;
  }
  
  export interface PrintArea {
    variant_ids: number[];
    placeholders: Placeholder[];
    font_color: string;
    font_family: string;
    background: string;
  }
  
  export interface Placeholder {
    position: string;
    images: PlaceholderImage[];
  }
  
  export interface PlaceholderImage {
    id: string;
    name: string;
    type: string;
    height: number;
    width: number;
    x: number;
    y: number;
    scale: number;
    angle: number;
    src: string;
    font_family?: string;
    font_size?: number;
    font_weight?: number;
    font_color?: string;
    input_text?: string;
  }
  
  export interface SalesChannelProperties {
    free_shipping: boolean;
  }
  
  export interface View {
    id: number;
    label: string;
    position: string;
    files: ViewFile[];
  }
  
  export interface ViewFile {
    src: string;
    variant_ids: number[];
  }
  