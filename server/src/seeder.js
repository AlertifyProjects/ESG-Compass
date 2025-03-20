import { connect } from 'mongoose';
import { config } from 'dotenv';
import { hash } from 'bcryptjs';
import { User, Organization, Metric } from '../models';

// Load env vars
config();

// Connect to DB
connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample data
const organizations = [
  {
    name: 'Sustainable Ventures',
    industry: 'Technology',
    size: 'medium',
    headquarters: {
      country: 'United States',
      city: 'San Francisco'
    },
    foundingYear: 2015,
    publiclyTraded: false,
    subscriptionTier: 'professional',
    subscriptionStatus: 'active',
    activeFrameworks: ['GRI', 'SASB']
  },
  {
    name: 'EcoManufacturing Inc.',
    industry: 'Manufacturing',
    size: 'large',
    headquarters: {
      country: 'Germany',
      city: 'Berlin'
    },
    foundingYear: 2005,
    publiclyTraded: true,
    stockSymbol: 'ECO',
    subscriptionTier: 'enterprise',
    subscriptionStatus: 'active',
    activeFrameworks: ['GRI', 'TCFD', 'CDP']
  }
];

// Standard metrics
const standardMetrics = [
  // Environmental metrics
  {
    name: 'Greenhouse Gas Emissions - Scope 1',
    description: 'Direct GHG emissions from sources owned or controlled by the organization',
    category: 'environmental',
    subcategory: 'emissions',
    unit: 'tonnes CO2e',
    frameworks: [
      { name: 'GRI', identifier: 'GRI 305-1' },
      { name: 'TCFD', identifier: 'Metrics and Targets' }
    ],
    dataType: 'number',
    isCustom: false
  },
  {
    name: 'Greenhouse Gas Emissions - Scope 2',
    description: 'Indirect GHG emissions from purchased electricity, heat, and steam',
    category: 'environmental',
    subcategory: 'emissions',
    unit: 'tonnes CO2e',
    frameworks: [
      { name: 'GRI', identifier: 'GRI 305-2' },
      { name: 'TCFD', identifier: 'Metrics and Targets' }
    ],
    dataType: 'number',
    isCustom: false
  },
  {
    name: 'Total Water Consumption',
    description: 'Total volume of water withdrawn for operations',
    category: 'environmental',
    subcategory: 'water',
    unit: 'cubic meters',
    frameworks: [
      { name: 'GRI', identifier: 'GRI 303-5' }
    ],
    dataType: 'number',
    isCustom: false
  },
  
  // Social metrics
  {
    name: 'Gender Diversity - Board',
    description: 'Percentage of women on the board of directors',
    category: 'social',
    subcategory: 'diversity',
    unit: 'percentage',
    frameworks: [
      { name: 'GRI', identifier: 'GRI 405-1' },
      { name: 'SASB', identifier: 'Varies by industry' }
    ],
    dataType: 'percentage',
    isCustom: false
  },
  {
    name: 'Employee Turnover Rate',
    description: 'Annual rate of employee departures',
    category: 'social',
    subcategory: 'labor',
    unit: 'percentage',
    frameworks: [
      { name: 'GRI', identifier: 'GRI 401-1' }
    ],
    dataType: 'percentage',
    isCustom: false
  },
  
  // Governance metrics
  {
    name: 'Board Independence',
    description: 'Percentage of independent board members',
    category: 'governance',
    subcategory: 'board',
    unit: 'percentage',
    frameworks: [
      { name: 'SASB', identifier: 'Varies by industry' }
    ],
    dataType: 'percentage',
    isCustom: false
  },
  {
    name: 'Ethics Policy',
    description: 'Organization has a documented ethics policy',
    category: 'governance',
    subcategory: 'ethics',
    unit: '',
    frameworks: [
      { name: 'GRI', identifier: 'GRI 102-16' }
    ],
    dataType: 'boolean',
    isCustom: false
  }
];

// Seed database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Organization.deleteMany();
    await Metric.deleteMany();

    console.log('Data cleared...');

    // Create organizations
    const createdOrgs = await Organization.insertMany(organizations);
    console.log(`${createdOrgs.length} organizations created`);

    // Create standard metrics
    const createdMetrics = await Metric.insertMany(standardMetrics);
    console.log(`${createdMetrics.length} standard metrics created`);

    // Create admin user
    const adminPassword = await hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@esgcompass.com',
      password: adminPassword,
      role: 'admin',
      organization: createdOrgs[0]._id
    });
    console.log(`Admin user created with email: ${adminUser.email}`);

    // Create test users for each organization
    for (const org of createdOrgs) {
      const userPassword = await hash('password123', 10);
      const user = await User.create({
        name: `User for ${org.name}`,
        email: `user@${org.name.toLowerCase().replace(/\s/g, '')}.com`,
        password: userPassword,
        role: 'editor',
        organization: org._id
      });
      console.log(`Test user created with email: ${user.email}`);
    }

    console.log('Database seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();