pipeline {
    agent any
    tools { nodejs 'node24' }
    environment {
        appName = 'mesh-business-frontend'
        DATE = new Date().format('yy.M')
        TAG = "${appName}-${DATE}-${BUILD_NUMBER}"
        DOCKER_BUILDKIT = '1'
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = '692327579998'
    }
    stages {
        stage('Checkout') { 
            steps { 
                script {
                    def scmVars = checkout scm
                    env.BRANCH_NAME = scmVars.GIT_BRANCH.replace('origin/', '')
                    echo "Building branch: ${env.BRANCH_NAME}"
                }
            }
        }

        stage('Set Branch-Specific Variables') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'production') {
                        env.REPO_NAME = 'mesh-business-frontend-prod'
                        env.DEPLOY_PATH = '/home/production/frontend'  
                        env.DEPLOY_USER = 'lloyd'            
                        env.DEPLOY_SERVER = '136.243.111.91'      
                        env.COMPOSE_FILE = 'docker-compose-prod.yaml'
                        env.ENV_FILE = 'mesh-business-frontend-prod'
                        env.DEPLOY_TYPE = 'docker-compose-frontend'
                    } else if (env.BRANCH_NAME == 'main') {
                        env.REPO_NAME = 'mesh-business-frontend'
                        env.DEPLOY_PATH = '/home/lloyd/project' 
                        env.DEPLOY_USER = 'lloyd'
                        env.DEPLOY_SERVER = '168.231.79.164'
                        env.COMPOSE_FILE = 'docker-compose.yaml'
                        env.ENV_FILE = 'mesh-business-config'
                        env.DEPLOY_TYPE = 'docker-compose'
                    } else {
                        error("Unsupported branch: ${env.BRANCH_NAME}")
                    }
                    echo "REPO_NAME: ${env.REPO_NAME}"
                    echo "DEPLOY_TYPE: ${env.DEPLOY_TYPE}"
                    echo "DEPLOY_SERVER: ${env.DEPLOY_SERVER}"
                }
            }
        }

        stage('Load Environment Config') {
            steps {
                script {
                    configFileProvider([
                        configFile(fileId: env.ENV_FILE, targetLocation: '.env.deployment-frontend')
                    ]) {
                        sh """
                            echo "TAG=${TAG}" >> .env.deployment-frontend
                            echo "AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID}" >> .env.deployment-frontend
                            echo "AWS_REGION=${AWS_REGION}" >> .env.deployment-frontend
                            echo "REPO_NAME=${REPO_NAME}" >> .env.deployment-frontend
                            echo "Environment configuration loaded for ${env.BRANCH_NAME}"
                        """
                    }
                }
            }
        }

        stage('Clean Docker Images') {
            steps {
                sh "docker system prune -af || true"
            }
        } 

        stage('Build Image') {
            when { expression { env.BRANCH_NAME in ['main', 'production'] } }
            steps {
                sh '''#!/bin/bash 
                    set -a
                    [ -f .env.deployment-frontend ] && source .env.deployment-frontend
                    set +a
                    docker build \
                        --build-arg NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL}" \\
                        --build-arg NEXTAUTH_URL="${NEXTAUTH_URL}" \\
                        --build-arg NODE_ENV="${NODE_ENV}" \\
                        -t ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}:${TAG} .
                '''
            }
        }

        stage('Scan Image') {
            when { expression { env.BRANCH_NAME in ['main', 'production'] } }
            steps {
                sh """
                    trivy image --format table -o UM_Assessment.txt \
                    --ignore-unfixed --severity LOW,MEDIUM,HIGH,CRITICAL \
                    ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}:${TAG}
                """
            }
        }

        stage('Push to ECR') {
            when { expression { env.BRANCH_NAME in ['main', 'production'] } }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', 
                            credentialsId: 'ACCOUNT-CREDENTIAL']]) {
                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} | \
                        docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                        docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}:${TAG}
                    """
                }
            }
        }

        stage('Post-Push Image Scan') {
            when { expression { env.BRANCH_NAME in ['main', 'production'] } }
            steps {
                sh """
                    trivy image --timeout 30m --exit-code 0 --skip-dirs .git \
                    --scanners vuln --format table \
                    ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}:${TAG} > trivy-image-scan.txt
                """
            }
        }

        stage('Deploy to VM') {
            when { expression { env.BRANCH_NAME in ['main', 'production'] } }
            steps {
                script {
                    sshagent(credentials: ['DEPLOY-KEY']) {
                        sh """
                            set -e
                            echo "Deploying ${env.BRANCH_NAME} to ${env.DEPLOY_SERVER}"
                            
                            scp -o StrictHostKeyChecking=no ${COMPOSE_FILE} nginx.conf ${DEPLOY_USER}@${DEPLOY_SERVER}:${DEPLOY_PATH}/
                            scp -o StrictHostKeyChecking=no .env.deployment-frontend ${DEPLOY_USER}@${DEPLOY_SERVER}:${DEPLOY_PATH}/.env.deployment-frontend

                            ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} "cd ${DEPLOY_PATH} && \
                                export TAG=${TAG} && \
                                export AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID} && \
                                export AWS_REGION=${AWS_REGION} && \
                                export REPO_NAME=${REPO_NAME}
                                
                                aws ecr get-login-password --region ${AWS_REGION} | \
                                docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com && \
                                
                                docker compose -f ${COMPOSE_FILE} down --remove-orphans || true && \
                                docker compose -f ${COMPOSE_FILE} pull || true && \
                                TAG=${TAG} docker compose -f ${COMPOSE_FILE} up -d && \
                                docker image prune -f || true 
                                #sleep 10
                                #docker compose -f ${COMPOSE_FILE} ps
                            "
                        """
                    }
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    sshagent(credentials: ['DEPLOY-KEY']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} "
                                cd ${DEPLOY_PATH}
                                if docker-compose -f ${COMPOSE_FILE} ps | grep -q 'Up'; then
                                    echo '✅ Containers are running'
                                else
                                    echo '❌ Some containers are not running'
                                    docker-compose -f ${COMPOSE_FILE} ps
                                    exit 1
                                fi
                            "
                        """
                    }
                }
            }
        }

        stage('CleanUp WS') {
            steps { 
                cleanWs() 
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '*.txt', allowEmptyArchive: true
            sh "docker rmi ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}:${TAG} || true"
        }
        success {
            echo "✅ ${env.BRANCH_NAME.toUpperCase()} Deployment to VM Successful!"
        }
        failure {
            echo "❌ VM Deployment Failed for ${env.BRANCH_NAME.toUpperCase()} Branch"
            script {
                sshagent(credentials: ['DEPLOY-KEY']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} "
                            cd ${DEPLOY_PATH}
                            echo '=== Container Status ==='
                            docker-compose -f ${COMPOSE_FILE} ps || true
                            echo '=== Recent Logs ==='
                            docker-compose -f ${COMPOSE_FILE} logs --tail=50 || true
                        "
                    """
                }
            }
        }
    }
}
