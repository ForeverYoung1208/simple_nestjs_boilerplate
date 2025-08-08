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
