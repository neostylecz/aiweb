-- Seed data: singleton settings + starter pages/services/portfolio so the
-- site renders meaningfully out of the box. All of this is editable via
-- /admin afterwards - nothing here is Lorem Ipsum, but it is still sample
-- copy meant to be reviewed and replaced with real content.

insert into public.site_settings (id, site_name, default_seo_title, default_seo_description, robots_index)
values (
  1,
  'NEOAIWEBY',
  'NEOAIWEBY — AI-driven web design & development',
  'NEOAIWEBY builds fast, modern websites and digital products powered by thoughtful design and applied AI.',
  true
)
on conflict (id) do nothing;

insert into public.contact_info (id, company_name, address, phone, email, company_id, vat_id, social_links)
values (
  1,
  'NEOAIWEBY s.r.o.',
  'Update this address in /admin → Contact information',
  '+420 000 000 000',
  'hello@neoaiweby.com',
  '00000000',
  'CZ00000000',
  '[{"platform":"linkedin","url":"https://www.linkedin.com"},{"platform":"instagram","url":"https://www.instagram.com"}]'::jsonb
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Services
-- ---------------------------------------------------------------------------

insert into public.services (title, slug, short_description, full_description, icon, status, display_order)
values
  (
    'Web Design & Development',
    'web-design-development',
    'Custom, high-performance websites built on modern frameworks and design systems.',
    'We design and build marketing sites, product sites, and web apps from the ground up — combining strong visual design with clean, maintainable code. Every project ships with a component-based design system, responsive layouts, and performance and accessibility built in from day one.',
    'code',
    'published',
    1
  ),
  (
    'AI Integration',
    'ai-integration',
    'Practical AI features — chat assistants, automation, and content tools — built into your product.',
    'We help teams add applied AI to their websites and internal tools: conversational assistants, content generation, intelligent search, and workflow automation. We focus on reliability and measurable impact rather than novelty.',
    'sparkles',
    'published',
    2
  ),
  (
    'Brand & Visual Identity',
    'brand-visual-identity',
    'Logo, typography, color systems, and design guidelines for a consistent brand.',
    'A strong digital presence starts with a clear identity. We develop logos, color and typography systems, and design guidelines that keep every touchpoint — web, print, and product — consistent and recognisable.',
    'palette',
    'published',
    3
  ),
  (
    'Ongoing Support & Growth',
    'ongoing-support-growth',
    'Maintenance, content updates, performance monitoring, and iterative improvements.',
    'Launch is the start, not the finish. We offer ongoing maintenance, content and feature updates, performance monitoring, and iterative design/growth work so your site keeps improving after launch.',
    'trending-up',
    'published',
    4
  );

-- ---------------------------------------------------------------------------
-- Portfolio
-- ---------------------------------------------------------------------------

insert into public.portfolio_items (
  title, slug, client_name, short_description, full_description,
  project_url, published_date, status, display_order
)
values
  (
    'Modernizing an e-commerce storefront',
    'modernizing-ecommerce-storefront',
    'Sample Retail Co.',
    'A full storefront redesign focused on speed, conversion, and a clean checkout flow.',
    'We rebuilt the storefront on a modern stack, cutting load times significantly and redesigning the product and checkout pages around clarity and trust. The result: a faster, more accessible shopping experience and a measurable lift in conversion.',
    'https://example.com',
    current_date - interval '60 days',
    'published',
    1
  ),
  (
    'AI-assisted support portal',
    'ai-assisted-support-portal',
    'Sample SaaS Inc.',
    'A self-service help center with an AI assistant that answers questions from real documentation.',
    'We designed and built a help center backed by an AI assistant trained on the client''s own documentation, reducing repetitive support tickets while giving customers instant, accurate answers.',
    'https://example.com',
    current_date - interval '120 days',
    'published',
    2
  ),
  (
    'Corporate rebrand & website relaunch',
    'corporate-rebrand-website-relaunch',
    'Sample Industries a.s.',
    'A full brand refresh paired with a new corporate website built for clarity and credibility.',
    'From a new visual identity to a rebuilt corporate website, this project modernized how the client presents itself to partners and customers — with a flexible content system their team manages independently.',
    null,
    current_date - interval '200 days',
    'published',
    3
  );

-- Link portfolio items to the services that were provided.
insert into public.portfolio_item_services (portfolio_item_id, service_id)
select pi.id, s.id
from public.portfolio_items pi
join public.services s on s.slug in ('web-design-development', 'brand-visual-identity')
where pi.slug = 'modernizing-ecommerce-storefront';

insert into public.portfolio_item_services (portfolio_item_id, service_id)
select pi.id, s.id
from public.portfolio_items pi
join public.services s on s.slug in ('ai-integration', 'ongoing-support-growth')
where pi.slug = 'ai-assisted-support-portal';

insert into public.portfolio_item_services (portfolio_item_id, service_id)
select pi.id, s.id
from public.portfolio_items pi
join public.services s on s.slug in ('web-design-development', 'brand-visual-identity')
where pi.slug = 'corporate-rebrand-website-relaunch';

-- ---------------------------------------------------------------------------
-- Pages + sections
-- ---------------------------------------------------------------------------

insert into public.pages (slug, title, status, seo_title, seo_description)
values
  ('home', 'Home', 'published', 'NEOAIWEBY — AI-driven web design & development', 'We design and build modern, fast, AI-powered websites and digital products for ambitious companies.'),
  ('services', 'Services', 'published', 'Services — NEOAIWEBY', 'Web design, development, AI integration, brand identity, and ongoing support from NEOAIWEBY.'),
  ('portfolio', 'Portfolio', 'published', 'Portfolio — NEOAIWEBY', 'Selected projects and case studies from NEOAIWEBY.'),
  ('contact', 'Contact', 'published', 'Contact — NEOAIWEBY', 'Get in touch with NEOAIWEBY to discuss your next project.');

-- Home page sections
insert into public.page_sections (page_id, type, status, display_order, content)
select p.id, v.type::public.section_type, 'published', v.display_order, v.content::jsonb
from public.pages p
cross join (
  values
    (1, 'hero', '{
      "eyebrow": "AI-driven digital studio",
      "heading": "Websites that think as sharp as your business.",
      "subheading": "NEOAIWEBY designs and builds fast, modern websites and digital products, blending strong design fundamentals with practical AI.",
      "primaryCta": {"label": "Start a project", "href": "/contact"},
      "secondaryCta": {"label": "See our work", "href": "/portfolio"}
    }'),
    (2, 'benefits', '{
      "heading": "Why teams work with us",
      "subheading": "A small, senior team that moves fast without cutting corners.",
      "items": [
        {"title": "Senior craft", "description": "Every project is designed and built by senior people, not handed off to juniors.", "icon": "gem"},
        {"title": "AI where it helps", "description": "We add AI features when they create real value, never as decoration.", "icon": "sparkles"},
        {"title": "Built to change", "description": "Structured content and clean code so your team can keep editing after launch.", "icon": "layers"},
        {"title": "Performance first", "description": "Fast, accessible, and SEO-ready by default, not as an afterthought.", "icon": "gauge"}
      ]
    }'),
    (3, 'services', '{
      "heading": "What we do",
      "subheading": "End-to-end design and development, with AI integrated where it counts.",
      "limit": 4,
      "ctaLabel": "View all services",
      "ctaHref": "/services"
    }'),
    (4, 'stats', '{
      "heading": "Results, not just deliverables",
      "items": [
        {"value": "40+", "label": "Projects shipped"},
        {"value": "98", "label": "Avg. Lighthouse score", "suffix": "/100"},
        {"value": "12", "label": "Industries served"},
        {"value": "5", "label": "Years building on the web"}
      ]
    }'),
    (5, 'portfolio', '{
      "heading": "Recent work",
      "subheading": "A few of the projects we have shipped recently.",
      "limit": 3,
      "ctaLabel": "See all projects",
      "ctaHref": "/portfolio"
    }'),
    (6, 'faq', '{
      "heading": "Frequently asked questions",
      "items": [
        {"question": "What does a typical project look like?", "answer": "Most engagements start with a short discovery phase, followed by design, development, and launch — usually 4 to 10 weeks depending on scope."},
        {"question": "Do you work with existing brands?", "answer": "Yes. We regularly redesign and rebuild existing sites, and can work within an existing brand system or help evolve it."},
        {"question": "Can we edit content ourselves after launch?", "answer": "Yes — every page, service, and portfolio entry is editable from the admin area without touching code."},
        {"question": "Do you offer ongoing support?", "answer": "Yes, we offer maintenance and iterative growth work after launch — see our Ongoing Support & Growth service."}
      ]
    }'),
    (7, 'cta', '{
      "heading": "Have a project in mind?",
      "subheading": "Tell us about it — we usually reply within one business day.",
      "primaryCta": {"label": "Get in touch", "href": "/contact"}
    }')
) as v(display_order, type, content)
where p.slug = 'home';

-- Services page sections
insert into public.page_sections (page_id, type, status, display_order, content)
select p.id, v.type::public.section_type, 'published', v.display_order, v.content::jsonb
from public.pages p
cross join (
  values
    (1, 'hero', '{
      "eyebrow": "Services",
      "heading": "Design, development, and AI — under one roof.",
      "subheading": "From a first prototype to long-term support, we cover the full lifecycle of your website or digital product."
    }'),
    (2, 'services', '{
      "heading": "All services",
      "subheading": null,
      "limit": null,
      "ctaLabel": null,
      "ctaHref": null,
      "variant": "detailed"
    }'),
    (3, 'cta', '{
      "heading": "Not sure which service you need?",
      "subheading": "Tell us about your project and we will point you in the right direction.",
      "primaryCta": {"label": "Get in touch", "href": "/contact"}
    }')
) as v(display_order, type, content)
where p.slug = 'services';

-- Portfolio page sections
insert into public.page_sections (page_id, type, status, display_order, content)
select p.id, v.type::public.section_type, 'published', v.display_order, v.content::jsonb
from public.pages p
cross join (
  values
    (1, 'hero', '{
      "eyebrow": "Portfolio",
      "heading": "Selected projects.",
      "subheading": "A look at recent work across e-commerce, SaaS, and corporate websites."
    }'),
    (2, 'portfolio', '{
      "heading": "All projects",
      "subheading": null,
      "limit": null,
      "ctaLabel": null,
      "ctaHref": null
    }')
) as v(display_order, type, content)
where p.slug = 'portfolio';

-- Contact page sections
insert into public.page_sections (page_id, type, status, display_order, content)
select p.id, v.type::public.section_type, 'published', v.display_order, v.content::jsonb
from public.pages p
cross join (
  values
    (1, 'hero', '{
      "eyebrow": "Contact",
      "heading": "Let''s talk about your project.",
      "subheading": "Fill in the form below or reach out directly — we usually reply within one business day."
    }'),
    (2, 'contact', '{
      "heading": "Send us a message",
      "subheading": null
    }')
) as v(display_order, type, content)
where p.slug = 'contact';
