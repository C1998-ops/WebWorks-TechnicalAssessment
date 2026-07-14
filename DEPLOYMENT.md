# AWS Deployment Setup Guide

This document explains how to deploy the CRM application using AWS Amplify (frontend) and EC2 (backend) with GitHub Actions for CI/CD.

## Prerequisites

- AWS Account with appropriate permissions
- GitHub repository
- EC2 instance running Ubuntu
- Node.js 18+ installed locally

## Frontend Deployment (Amplify)

### 1. Connect Amplify to GitHub

1. Go to AWS Amplify Console
2. Click "New app" → "Host web app"
3. Select GitHub as the repository provider
4. Authorize Amplify to access your GitHub repository
5. Select the `crm-dashboard` folder as the root directory

### 2. Configure Build Settings

The `amplify.yml` file in the `crm-dashboard` directory contains the build configuration:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### 3. Environment Variables

Set these in Amplify Console under App Settings → Environment Variables:

- `VITE_API_URL`: Your backend API URL (e.g., http://your-ec2-ip:3000)

## Backend Deployment (EC2)

### Option 1: SSH Deployment

#### 1. Set up GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
- `AWS_REGION`: Your AWS region (e.g., us-east-1)
- `EC2_IP`: Your EC2 instance public IP
- `EC2_USER`: EC2 username (default: ubuntu)
- `EC2_SSH_KEY`: Your EC2 SSH private key

#### 2. Configure EC2 Instance

SSH into your EC2 instance:

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

Install Node.js and PM2:

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pm2
```

#### 3. Update GitHub Workflow

Uncomment the SSH deployment section in `.github/workflows/deploy.yml`:

```yaml
- name: Deploy to EC2
  run: |
    mkdir -p ~/.ssh
    echo "${{ secrets.EC2_SSH_KEY }}" > ~/.ssh/ec2_key.pem
    chmod 600 ~/.ssh/ec2_key.pem
    scp -i ~/.ssh/ec2_key.pem -r crm-backend/* ${{ secrets.EC2_USER }}@${{ secrets.EC2_IP }}:/home/app/
    ssh -i ~/.ssh/ec2_key.pem ${{ secrets.EC2_USER }}@${{ secrets.EC2_IP }} 'cd /home/app && npm install && pm2 restart backend'
```

### Option 2: AWS CodeDeploy

#### 1. Create CodeDeploy Application

```bash
aws deploy create-application --application-name crm-backend
```

#### 2. Create Deployment Group

```bash
aws deploy create-deployment-group \
  --application-name crm-backend \
  --deployment-group-name production \
  --deployment-config-name CodeDeployDefault.OneAtATime \
  --ec2-tag-filters Key=Name,Value=crm-backend,Type=KEY_AND_VALUE \
  --service-role-arn arn:aws:iam::ACCOUNT_ID:role/CodeDeployServiceRole
```

#### 3. Set up GitHub Secrets

Add these additional secrets:

- `CODEDEPLOY_APP`: crm-backend
- `CODEDEPLOY_GROUP`: production
- `S3_BUCKET`: Your S3 bucket name

#### 4. Update GitHub Workflow

Uncomment the CodeDeploy section in `.github/workflows/deploy.yml`.

#### 5. Make Scripts Executable

```bash
chmod +x crm-backend/scripts/*.sh
```

## Manual Deployment

### Deploy Backend Manually

```bash
cd crm-backend
export EC2_HOST=your-ec2-ip
export EC2_KEY_PATH=~/.ssh/your-key.pem
./deploy.sh
```

## Security Best Practices

1. **Use IAM Roles**: Instead of access keys, use IAM roles for EC2 instances
2. **Security Groups**: Restrict inbound traffic to necessary ports only
3. **SSH Keys**: Never commit SSH keys to the repository
4. **Environment Variables**: Store sensitive data in AWS Secrets Manager or Parameter Store
5. **HTTPS**: Enable SSL/TLS for production deployments

## Troubleshooting

### Frontend Build Fails

- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check build logs in Amplify Console

### Backend Deployment Fails

- Verify EC2 instance is accessible
- Check SSH key permissions (should be 600)
- Ensure PM2 is installed on EC2
- Check firewall/security group settings

### GitHub Actions Fails

- Verify all secrets are correctly configured
- Check workflow logs for specific error messages
- Ensure AWS credentials have necessary permissions

## Monitoring

- **Frontend**: Use Amplify Console logs
- **Backend**: Use PM2 monitoring: `pm2 monit`
- **EC2**: Use CloudWatch metrics and logs
