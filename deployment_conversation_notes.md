# Deployment Conversation Notes

## Project Context
- **Project**: Simple NestJS project boilerplate
- **Current setup**: Docker Compose with API (NestJS) + PostgreSQL
- **Location**: `/home/ihor/study/simple_nestjs_project_boilerplate`

## Issue Encountered
- Docker build error: missing `postgresql.conf` file in `docker/postgres/` directory
- Dockerfile tries to copy `./docker/postgres/postgresql.conf` but file doesn't exist
- **Status**: User identified the issue and will fix it themselves

## Deployment Discussion

### AWS Deployment Options Considered:

#### 1. AWS Fargate + RDS (Initially considered)
- **Pros**: Serverless, managed database, auto-scaling
- **Cons**: More complex for simple test project, higher cost
- **Conclusion**: Overkill for this use case

#### 2. Single EC2 Instance (Chosen approach)
- **Pros**: Simple, cost-effective, direct control
- **Cons**: Single point of failure, manual management
- **Decision**: Best fit for test project

### GitHub Actions Deployment Options:

#### Option 1: SSH + Docker Compose (Simplest)
- SSH into EC2 from GitHub Actions
- Pull code, rebuild and restart containers
- Uses `appleboy/ssh-action`

#### Option 2: Push to ECR + Pull on EC2
- Build image in GitHub Actions
- Push to ECR
- SSH to EC2 and pull new image

#### Option 3: AWS CodeDeploy
- More complex, AWS-native solution

### Application Restart/Recovery Options:

#### Option 1: Docker Compose Restart Policies (Recommended)
```yaml
restart: unless-stopped  # or "always"
```

#### Option 2: Systemd Service
- Manage docker-compose as systemd service
- Handles server reboots

#### Option 3: PM2 Inside Container
- Usually overkill when Docker provides restart capabilities

### Required Setup:
- EC2 instance with Docker and docker-compose
- GitHub Secrets: `EC2_HOST`, `EC2_SSH_KEY`
- Security group configuration
- Health checks for monitoring

## Next Steps:
1. Fix the missing `postgresql.conf` file
2. Set up EC2 instance
3. Configure GitHub Actions workflow
4. Implement restart policies
5. Add health checks and monitoring

## Key Decisions Made:
- ✅ Use single EC2 instance instead of Fargate
- ✅ Deploy via GitHub Actions with SSH approach
- ✅ Use Docker restart policies for failure recovery
- ⏳ User will fix the PostgreSQL config issue first

## Status: 
- Conversation paused
- User will continue deployment setup later
- All options and approaches documented for reference



## The Problem:
1. CDK deploys infrastructure → EC2 starts → UserData runs → tries to download from empty S3 bucket → FAILS
2. Then the script uploads code to S3 (too late!)

## Solution Options:

### Option 1: Two-stage deployment (Recommended)
bash
#!/bin/bash
set -e

echo "Stage 1: Deploy infrastructure without starting services..."
cd infra
npm run build
cdk deploy --require-approval never

echo "Stage 2: Upload code..."
BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name InfraStack --query "Stacks[0].Outputs[?OutputKey=='CodeBucketName'].OutputValue" --output text)
cd ..
aws s3 sync . s3://$BUCKET_NAME/ \
  --exclude "node_modules/*" \
  --exclude ".git/*" \
  --exclude "infra/node_modules/*" \
  --exclude "infra/cdk.out/*"

echo "Stage 3: Trigger code deployment on EC2..."
INSTANCE_ID=$(aws cloudformation describe-stacks --stack-name InfraStack --query "Stacks[0].Outputs[?OutputKey=='InstanceId'].OutputValue" --output text)

# Send command to download and start services
aws ssm send-command \
  --instance-ids $INSTANCE_ID \
  --document-name "AWS-RunShellScript" \
  --parameters 'commands=[
    "cd /home/ec2-user/app",
    "aws s3 sync s3://'$BUCKET_NAME'/ . --region us-east-1",
    "chown -R ec2-user:ec2-user /home/ec2-user/app",
    "sudo -u ec2-user docker compose up -d",
    "sleep 30",
    "sudo -u ec2-user docker compose exec -T api npm run migration:run"
  ]'


### Option 2: Modify UserData to wait/retry
typescript
userData.addCommands(
  // ... existing setup commands
  
  // Wait and retry logic for S3 sync
  'cd /home/ec2-user/app',
  'for i in {1..30}; do',
  `  if aws s3 sync s3://${codeBucket.bucketName}/ . --region ${this.region}; then`,
  '    echo "Code downloaded successfully"',
  '    break',
  '  else',
  '    echo "Attempt $i: Code not ready, waiting 30 seconds..."',
  '    sleep 30',
  '  fi',
  'done',
  
  // Only start services if code was downloaded
  'if [ "$(ls -A /home/ec2-user/app)" ]; then',
  '  chown -R ec2-user:ec2-user /home/ec2-user/app',
  '  sudo -u ec2-user docker compose up -d',
  '  sleep 30',
  '  sudo -u ec2-user docker compose exec -T api npm run migration:run',
  'else',
  '  echo "ERROR: No code found in app directory"',
  'fi',
);


### Option 3: Pre-upload code to S3 in CDK
typescript
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

// Deploy code as part of CDK stack
new s3deploy.BucketDeployment(this, `${projectName}CodeDeployment`, {
  sources: [s3deploy.Source.asset('../', {
    exclude: ['node_modules', '.git', 'infra/node_modules', 'infra/cdk.out'],
  })],
  destinationBucket: codeBucket,
});


I recommend Option 1 - it's the most reliable and gives you control over the deployment process. Would you like me to show you the complete two-
stage deployment script?

> 
