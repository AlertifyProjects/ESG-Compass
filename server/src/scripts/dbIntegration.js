import { connect } from 'mongoose';
import { config } from 'dotenv';
import { User, Organization, Metric, MetricData, Report } from '../models';

// Load env vars
config();

// Connect to DB
connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const runDatabaseOperations = async () => {
  try {
    console.log('Starting database operations...');
    
    // Example: Update all metrics of a certain category
    const updateResult = await Metric.updateMany(
      { category: 'environmental' },
      { $set: { isImportant: true } }
    );
    
    console.log(`Updated ${updateResult.nModified} environmental metrics`);
    
    // Example: Count documents by category
    const environmentalCount = await Metric.countDocuments({ category: 'environmental' });
    const socialCount = await Metric.countDocuments({ category: 'social' });
    const governanceCount = await Metric.countDocuments({ category: 'governance' });
    
    console.log('Metric counts by category:');
    console.log(`Environmental: ${environmentalCount}`);
    console.log(`Social: ${socialCount}`);
    console.log(`Governance: ${governanceCount}`);
    
    // Example: Find organizations with specific frameworks
    const orgsWithGRI = await Organization.find({ 
      activeFrameworks: 'GRI' 
    }).select('name subscriptionTier');
    
    console.log('Organizations using GRI framework:');
    console.log(orgsWithGRI);
    
    // Example: Aggregate metric data for reporting
    const metricDataAggregation = await MetricData.aggregate([
      {
        $lookup: {
          from: 'metrics',
          localField: 'metric',
          foreignField: '_id',
          as: 'metricInfo'
        }
      },
      {
        $unwind: '$metricInfo'
      },
      {
        $group: {
          _id: '$metricInfo.category',
          count: { $sum: 1 },
          avgValue: { $avg: { $cond: [{ $isNumber: '$value' }, '$value', 0] } }
        }
      }
    ]);
    
    console.log('Metric data aggregation by category:');
    console.log(metricDataAggregation);
    
    console.log('Database operations completed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the database operations
runDatabaseOperations();