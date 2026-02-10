interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DisabilitasKu',
    description: 'Platform inklusif yang menghubungkan penyandang disabilitas dengan layanan terapi profesional dan dukungan komunitas di Indonesia.',
    url: 'https://disabilitasku.id',
    logo: 'https://disabilitasku.id/favicon.ico',
    foundingDate: '2024',
    founder: {
      '@type': 'Person',
      name: 'Bryan Wahyu',
      sameAs: [
        'https://www.facebook.com/bryan.wahyu/',
        'https://www.instagram.com/bryanwahyu/',
        'https://www.linkedin.com/in/bryan-wahyu-2b0360377/',
      ],
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+62-899-007-6060',
      email: 'bryanwahyukp95@gmail.com',
      contactType: 'customer service',
      availableLanguage: 'Indonesian',
    },
    sameAs: [
      'https://www.tiktok.com/@disabilitasku.id',
      'https://www.instagram.com/disabilitasku/',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jakarta',
      addressCountry: 'ID',
    },
  };

  return <JsonLd data={data} />;
}

export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DisabilitasKu',
    url: 'https://disabilitasku.id',
    description: 'Platform inklusif yang menghubungkan penyandang disabilitas dengan layanan terapi profesional dan dukungan komunitas di Indonesia.',
    inLanguage: 'id-ID',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://disabilitasku.id/layanan?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return <JsonLd data={data} />;
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

export function FAQJsonLd({ questions }: { questions: { question: string; answer: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': authorName ? 'Person' : 'Organization',
      name: authorName || 'DisabilitasKu',
    },
    publisher: {
      '@type': 'Organization',
      name: 'DisabilitasKu',
      logo: {
        '@type': 'ImageObject',
        url: 'https://disabilitasku.id/favicon.ico',
      },
    },
  };

  return <JsonLd data={data} />;
}

export function EventJsonLd({
  name,
  description,
  startDate,
  endDate,
  location,
  url,
}: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  url: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    endDate,
    url,
    organizer: {
      '@type': 'Organization',
      name: 'DisabilitasKu',
      url: 'https://disabilitasku.id',
    },
    location: location
      ? {
          '@type': 'Place',
          name: location,
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'ID',
          },
        }
      : undefined,
  };

  return <JsonLd data={data} />;
}

export function HealthServiceJsonLd({
  name,
  description,
  address,
  serviceType,
}: {
  name: string;
  description: string;
  address?: string;
  serviceType?: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name,
    description,
    medicalSpecialty: serviceType || 'Rehabilitation',
    address: address
      ? {
          '@type': 'PostalAddress',
          streetAddress: address,
          addressCountry: 'ID',
        }
      : undefined,
    isAccessibleForFree: false,
    availableService: {
      '@type': 'MedicalTherapy',
      name: serviceType || 'Terapi Rehabilitasi',
    },
  };

  return <JsonLd data={data} />;
}
