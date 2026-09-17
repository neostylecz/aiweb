// Hand-written mirror of the Supabase schema in supabase/migrations.
// Regenerate/adjust this alongside any migration change. If you have the
// Supabase CLI linked to a project, you can instead generate this file with:
//   supabase gen types typescript --linked > src/lib/supabase/types.ts

export type ContentStatus = "draft" | "published";
export type SectionType =
  | "hero"
  | "text"
  | "image_text"
  | "services"
  | "portfolio"
  | "benefits"
  | "stats"
  | "cta"
  | "faq"
  | "contact";
export type SubmissionStatus = "new" | "read" | "archived";

type Tables = {
  media: {
    Row: {
      id: string;
      bucket: string;
      storage_path: string;
      file_name: string;
      mime_type: string | null;
      size_bytes: number | null;
      width: number | null;
      height: number | null;
      alt_text: string | null;
      uploaded_by: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: Partial<Tables["media"]["Row"]> & {
      storage_path: string;
      file_name: string;
    };
    Update: Partial<Tables["media"]["Row"]>;
    Relationships: [];
  };
  pages: {
    Row: {
      id: string;
      slug: string;
      title: string;
      status: ContentStatus;
      seo_title: string | null;
      seo_description: string | null;
      seo_canonical_url: string | null;
      seo_og_image_id: string | null;
      seo_no_index: boolean;
      created_at: string;
      updated_at: string;
    };
    Insert: Partial<Tables["pages"]["Row"]> & { slug: string; title: string };
    Update: Partial<Tables["pages"]["Row"]>;
    Relationships: [
      {
        foreignKeyName: "pages_seo_og_image_id_fkey";
        columns: ["seo_og_image_id"];
        isOneToOne: false;
        referencedRelation: "media";
        referencedColumns: ["id"];
      },
    ];
  };
  page_sections: {
    Row: {
      id: string;
      page_id: string;
      type: SectionType;
      status: ContentStatus;
      display_order: number;
      content: Record<string, unknown>;
      created_at: string;
      updated_at: string;
    };
    Insert: Partial<Tables["page_sections"]["Row"]> & { page_id: string; type: SectionType };
    Update: Partial<Tables["page_sections"]["Row"]>;
    Relationships: [
      {
        foreignKeyName: "page_sections_page_id_fkey";
        columns: ["page_id"];
        isOneToOne: false;
        referencedRelation: "pages";
        referencedColumns: ["id"];
      },
    ];
  };
  services: {
    Row: {
      id: string;
      title: string;
      slug: string;
      short_description: string | null;
      full_description: string | null;
      icon: string | null;
      image_id: string | null;
      seo_title: string | null;
      seo_description: string | null;
      status: ContentStatus;
      display_order: number;
      created_at: string;
      updated_at: string;
    };
    Insert: Partial<Tables["services"]["Row"]> & { title: string; slug: string };
    Update: Partial<Tables["services"]["Row"]>;
    Relationships: [
      {
        foreignKeyName: "services_image_id_fkey";
        columns: ["image_id"];
        isOneToOne: false;
        referencedRelation: "media";
        referencedColumns: ["id"];
      },
    ];
  };
  portfolio_items: {
    Row: {
      id: string;
      title: string;
      slug: string;
      client_name: string | null;
      short_description: string | null;
      full_description: string | null;
      featured_image_id: string | null;
      project_url: string | null;
      published_date: string | null;
      seo_title: string | null;
      seo_description: string | null;
      status: ContentStatus;
      display_order: number;
      created_at: string;
      updated_at: string;
    };
    Insert: Partial<Tables["portfolio_items"]["Row"]> & { title: string; slug: string };
    Update: Partial<Tables["portfolio_items"]["Row"]>;
    Relationships: [
      {
        foreignKeyName: "portfolio_items_featured_image_id_fkey";
        columns: ["featured_image_id"];
        isOneToOne: false;
        referencedRelation: "media";
        referencedColumns: ["id"];
      },
    ];
  };
  portfolio_item_services: {
    Row: {
      portfolio_item_id: string;
      service_id: string;
    };
    Insert: Tables["portfolio_item_services"]["Row"];
    Update: Partial<Tables["portfolio_item_services"]["Row"]>;
    Relationships: [
      {
        foreignKeyName: "portfolio_item_services_portfolio_item_id_fkey";
        columns: ["portfolio_item_id"];
        isOneToOne: false;
        referencedRelation: "portfolio_items";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "portfolio_item_services_service_id_fkey";
        columns: ["service_id"];
        isOneToOne: false;
        referencedRelation: "services";
        referencedColumns: ["id"];
      },
    ];
  };
  portfolio_gallery: {
    Row: {
      id: string;
      portfolio_item_id: string;
      media_id: string;
      display_order: number;
      created_at: string;
    };
    Insert: Partial<Tables["portfolio_gallery"]["Row"]> & {
      portfolio_item_id: string;
      media_id: string;
    };
    Update: Partial<Tables["portfolio_gallery"]["Row"]>;
    Relationships: [
      {
        foreignKeyName: "portfolio_gallery_portfolio_item_id_fkey";
        columns: ["portfolio_item_id"];
        isOneToOne: false;
        referencedRelation: "portfolio_items";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "portfolio_gallery_media_id_fkey";
        columns: ["media_id"];
        isOneToOne: false;
        referencedRelation: "media";
        referencedColumns: ["id"];
      },
    ];
  };
  contact_submissions: {
    Row: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
      company: string | null;
      message: string;
      consent: boolean;
      status: SubmissionStatus;
      ip_hash: string | null;
      user_agent: string | null;
      created_at: string;
    };
    Insert: Partial<Tables["contact_submissions"]["Row"]> & {
      name: string;
      email: string;
      message: string;
    };
    Update: Partial<Tables["contact_submissions"]["Row"]>;
    Relationships: [];
  };
  contact_info: {
    Row: {
      id: number;
      company_name: string | null;
      address: string | null;
      phone: string | null;
      email: string | null;
      company_id: string | null;
      vat_id: string | null;
      social_links: { platform: string; url: string }[];
      extra: Record<string, unknown>;
      updated_at: string;
    };
    Insert: Partial<Tables["contact_info"]["Row"]>;
    Update: Partial<Tables["contact_info"]["Row"]>;
    Relationships: [];
  };
  site_settings: {
    Row: {
      id: number;
      site_name: string;
      default_seo_title: string | null;
      default_seo_description: string | null;
      default_og_image_id: string | null;
      robots_index: boolean;
      google_site_verification: string | null;
      updated_at: string;
    };
    Insert: Partial<Tables["site_settings"]["Row"]>;
    Update: Partial<Tables["site_settings"]["Row"]>;
    Relationships: [];
  };
  admin_users: {
    Row: {
      user_id: string;
      email: string | null;
      created_at: string;
    };
    Insert: Partial<Tables["admin_users"]["Row"]> & { user_id: string };
    Update: Partial<Tables["admin_users"]["Row"]>;
    Relationships: [];
  };
};

export interface Database {
  public: {
    Tables: Tables;
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      content_status: ContentStatus;
      section_type: SectionType;
      submission_status: SubmissionStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
