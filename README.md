# Project start

## 1. Start app

```bash
$ docker compose up
```

## 2. Run DB migrations

```bash
$ docker compose exec api npm run migration:run
```


# Deploy to AWS

We need to deploy two stacks - one for sertificate and one for main stack.
Sertificate stack is deployed in us-east-1 region, because it is required for Cloudfront distribution.
Main stack is deployed in the region you specified at your current aws cli configuration.

## Bootstrap Command:

```bash
# Bootstrap us-east-1 for certificate to use with Cloudfront distribution
cdk bootstrap aws://$(aws sts get-caller-identity --query Account --output text)/us-east-1 --context targetEnv=dev

# Bootstrap your main region (if not done)
cdk bootstrap aws://$(aws sts get-caller-identity --query Account --output text)/$(aws configure get region) --context targetEnv=dev
```

The bootstrap is a one-time setup per region and creates minimal, low-cost infrastructure that CDK needs to operate.

## Deploy

```bash
$ npx cdk deploy --all--context targetEnv=dev
```


## troubleshooting

### 1.  get ssh access key

```bash
aws ssm get-parameter --name "/ec2/keypair/key-07eedf646ad34d126" --with-decryption --query "Parameter.Value" --output text --region eu-central-1 > ~/.ssh/simplenestjs-dev-key.pem
```

Set proper permissions:

```bash
chmod 400 ~/.ssh/simplenestjs-dev-key.pem
```

### 2. Get the instance's public IP:

```bash
INSTANCE_IP=$(aws ec2 describe-instances --instance-ids i-05783b1bc9b341f7d --region eu-central-1 --query "Reservations[0].Instances[0].PublicIpAddress" --output text)
echo $INSTANCE_IP
```

### 3. SSH into the instance:

```bash
ssh -i ~/.ssh/simplenestjs-dev-key.pem ec2-user@$INSTANCE_IP
```
