// Enhanced tenant data with more details
export const tenantsData = {
  'Skyline Tower': [
    {
      name: 'Acme Tech Solutions',
      industry: 'Technology',
      contact: 'John Smith',
      leaseEnd: '2026-05-15',
      paymentStatus: 'current'
    },
    {
      name: 'Global Financial Partners',
      industry: 'Financial Services',
      contact: 'Emily Jones',
      leaseEnd: '2025-11-30',
      paymentStatus: 'current'
    }
  ],
  'Riverside Apartments': [
    {
      name: 'Blue Ocean Consulting',
      industry: 'Consulting',
      contact: 'Sarah Chen',
      leaseEnd: '2025-08-30',
      paymentStatus: 'current'
    },
    {
      name: 'Digital Dynamics',
      industry: 'Technology',
      contact: 'Mark Wilson',
      leaseEnd: '2024-12-15',
      paymentStatus: 'pending'
    }
  ],
  'Lakefront Mall': [
    {
      name: 'Evergreen Marketing Group',
      industry: 'Marketing',
      contact: 'Michael Wilson',
      leaseEnd: '2024-08-01',
      paymentStatus: 'late'
    },
    {
      name: 'Urban Fitness Co',
      industry: 'Health & Fitness',
      contact: 'Lisa Brown',
      leaseEnd: '2025-03-15',
      paymentStatus: 'current'
    }
  ],
  'Tech Park Plaza': [
    {
      name: 'Future Systems Inc',
      industry: 'Technology',
      contact: 'David Park',
      leaseEnd: '2026-02-28',
      paymentStatus: 'current'
    },
    {
      name: 'Cloud Solutions Ltd',
      industry: 'Technology',
      contact: 'Rachel Green',
      leaseEnd: '2025-09-30',
      paymentStatus: 'current'
    }
  ],
  'Sunset Heights': [
    {
      name: 'Creative Studios',
      industry: 'Media',
      contact: 'James Lee',
      leaseEnd: '2024-11-30',
      paymentStatus: 'current'
    },
    {
      name: 'Mountain View Medical',
      industry: 'Healthcare',
      contact: 'Dr. Emma White',
      leaseEnd: '2025-06-15',
      paymentStatus: 'current'
    }
  ],
  'Mountain View Industrial': [
    {
      name: 'Global Logistics Co',
      industry: 'Logistics',
      contact: 'Robert Black',
      leaseEnd: '2024-10-31',
      paymentStatus: 'pending'
    },
    {
      name: 'Advanced Manufacturing Ltd',
      industry: 'Manufacturing',
      contact: 'Thomas Gray',
      leaseEnd: '2025-04-30',
      paymentStatus: 'current'
    }
  ],
  'Hooksett Retail Center': [
    {
      name: 'Northeast Home Goods',
      industry: 'Retail',
      contact: 'Jessica Miller',
      leaseEnd: '2026-03-15',
      paymentStatus: 'current'
    },
    {
      name: 'Granite State Pharmacy',
      industry: 'Healthcare',
      contact: 'Andrew Peterson',
      leaseEnd: '2025-10-31',
      paymentStatus: 'current'
    }
  ],
  'River Street Plaza': [
    {
      name: 'Harbor View Financial',
      industry: 'Financial Services',
      contact: 'Sophia Martinez',
      leaseEnd: '2026-06-30',
      paymentStatus: 'current'
    },
    {
      name: 'East Coast Tech Labs',
      industry: 'Technology',
      contact: 'Benjamin Chen',
      leaseEnd: '2025-09-15',
      paymentStatus: 'current'
    }
  ]
}

// Sample property data with more comprehensive information
export const propertiesData = [
  {
    id: 'prop-evolston-001',
    name: 'Hooksett Retail Center',
    address: '555 Hooksett Road, Manchester, NH 03106',
    type: 'Commercial',
    category: 'Retail',
    sqft: 62000,
    units: 8,
    occupancy: 95,
    value: 18500000,
    roi: 8.7,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    status: 'active',
    fund: 'Babson Real Estate Fund I',
    description: 'Prime retail center with excellent highway visibility and strong anchor tenants.',
    tenants: tenantsData['Hooksett Retail Center'] || []
  },
  {
    id: 'prop-evolston-002',
    name: 'River Street Plaza',
    address: '522 River St, Boston, MA 02126',
    type: 'Commercial',
    category: 'Office',
    sqft: 78000,
    units: 12,
    occupancy: 90,
    value: 26700000,
    roi: 7.9,
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    status: 'active',
    fund: 'Babson Real Estate Fund I',
    description: 'Modern office complex in Boston\'s innovation district with waterfront views.',
    tenants: tenantsData['River Street Plaza'] || []
  },
  {
    id: 'prop-001',
    name: 'Skyline Tower',
    address: '123 Main Street, New York, NY 10001',
    type: 'Commercial',
    category: 'Office',
    sqft: 45000,
    units: 5,
    occupancy: 100,
    value: 12500000,
    roi: 8.2,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    status: 'active',
    fund: 'AriesView Fund II',
    description: 'A modern office tower in the heart of Manhattan.',
    tenants: tenantsData['Skyline Tower'] || []
  },
  {
    id: 'prop-002',
    name: 'Riverside Apartments',
    address: '456 River Dr, Chicago, IL 60601',
    type: 'Residential',
    category: 'Multi-family',
    sqft: 68000,
    units: 5,
    occupancy: 80,
    value: 22800000,
    roi: 7.5,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    status: 'active',
    fund: 'AriesView Fund I',
    description: 'Luxury apartments with river views.',
    tenants: tenantsData['Riverside Apartments'] || []
  },
  {
    id: 'prop-003',
    name: 'Lakefront Mall',
    address: '789 Lake View, Miami, FL 33101',
    type: 'Commercial',
    category: 'Retail',
    sqft: 125000,
    units: 5,
    occupancy: 60,
    value: 35000000,
    roi: 6.8,
    image: 'https://images.unsplash.com/photo-1606402179428-a57976d71fa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    status: 'active',
    fund: 'AriesView Fund II',
    description: 'Premium shopping center with lakefront access.',
    tenants: tenantsData['Lakefront Mall'] || []
  },
  {
    id: 'prop-004',
    name: 'Tech Park Plaza',
    address: '101 Innovation Dr, San Francisco, CA 94103',
    type: 'Commercial',
    category: 'Office',
    sqft: 85000,
    units: 5,
    occupancy: 100,
    value: 48000000,
    roi: 9.2,
    image: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    status: 'active',
    fund: 'AriesView Fund II',
    description: 'Modern office space in the tech district.',
    tenants: tenantsData['Tech Park Plaza'] || []
  },
  {
    id: 'prop-005',
    name: 'Sunset Heights',
    address: '555 Western Ave, Seattle, WA 98101',
    type: 'Residential',
    category: 'Apartments',
    sqft: 52000,
    units: 5,
    occupancy: 80,
    value: 18700000,
    roi: 8.0,
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    status: 'active',
    fund: 'AriesView Fund I',
    description: 'Upscale apartment complex with mountain views.',
    tenants: tenantsData['Sunset Heights'] || []
  },
  {
    id: 'prop-006',
    name: 'Mountain View Industrial',
    address: '888 Factory Ln, Denver, CO 80202',
    type: 'Industrial',
    category: 'Warehouse',
    sqft: 210000,
    units: 5,
    occupancy: 60,
    value: 28400000,
    roi: 10.5,
    image: 'https://images.unsplash.com/photo-1542889601-399c4f3a8402?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    status: 'active',
    fund: 'AriesView Fund II',
    description: 'Large industrial warehouse with modern amenities.',
    tenants: tenantsData['Mountain View Industrial'] || []
  },
  {
    id: 'prop-007',
    name: 'Downtown Lofts',
    address: '333 Urban Ave, Boston, MA 02108',
    type: 'Residential',
    category: 'Apartments',
    sqft: 75000,
    units: 5,
    occupancy: 0,
    value: 32000000,
    roi: 0,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    status: 'active',
    fund: 'Under Evaluation',
    description: 'Historic building converted to modern lofts.',
    tenants: []
  },
  {
    id: 'prop-008',
    name: 'Tech Hub Complex',
    address: '777 Innovation Blvd, Austin, TX 78701',
    type: 'Commercial',
    category: 'Office',
    sqft: 95000,
    units: 5,
    occupancy: 0,
    value: 42000000,
    roi: 0,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    status: 'active',
    fund: 'Under Evaluation',
    description: 'State-of-the-art office complex in tech hub.',
    tenants: []
  }
] 