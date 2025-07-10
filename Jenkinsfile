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
                    // Get branch name from SCM
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
                        env.REPO_NAME = 'mesh-business-frontend'
                        env.CLUSTER = 'faithhq-cluster'
                        env.DEPLOY_TYPE = 'kubernetes'
                        env.CONFIG_FILE_ID = 'k8s-production'
                    } else if (env.BRANCH_NAME == 'main') {
                        env.REPO_NAME = 'mesh-business-frontend'
                        env.DEPLOY_PATH = '/home/lloyd/project' 
                        env.DEPLOY_USER = 'lloyd'
                        env.DEPLOY_SERVER = '168.231.79.164'
                        env.COMPOSE_FILE = 'docker-compose.yaml'
                        env.DEPLOY_TYPE = 'docker-compose'
                        env.CONFIG_FILE_ID = 'mesh-business-config'
                    } else {
                        error("Unsupported branch: ${env.BRANCH_NAME}")
                    }
                    echo "REPO_NAME: ${env.REPO_NAME}"
                    echo "DEPLOY_TYPE: ${env.DEPLOY_TYPE}"
                }
            }
        }

        stage('Load Environment Config') {
            steps {
                script {
                    configFileProvider([
                        configFile(fileId: env.CONFIG_FILE_ID, targetLocation: '.env.staging')
                    ]) {
                        sh """
                            echo "TAG=${TAG}" >> .env.staging
                            echo "AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID}" >> .env.staging
                            echo "AWS_REGION=${AWS_REGION}" >> .env.staging
                            echo "REPO_NAME=${REPO_NAME}" >> .env.staging
                            echo "Environment configuration loaded"
                        """
                    }
                }
            }
        }

        stage('Clean Docker Images') {
            steps {
                sh "docker system prune -af"
            }
        }

        stage('Build Image') {
            steps {
                script {
                    configFileProvider([
                        configFile(fileId: env.CONFIG_FILE_ID, targetLocation: '.env.staging')
                    ]) {
                        sh '''#!/bin/bash
                            set -a
                            source .env.staging
                            set +a
                            
                            docker build \\
                                --build-arg NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL}" \\
                                --build-arg NEXTAUTH_URL="${NEXTAUTH_URL}" \\
                                --build-arg NODE_ENV="${NODE_ENV}" \\
                                -t ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}:${TAG} .
                        '''
                    }
                }
            }
        }

        stage('Scan Image') {
            steps {
                sh """
                    trivy image --format table -o UM_Assessment.txt \\
                    --ignore-unfixed --severity LOW,MEDIUM,HIGH,CRITICAL \\
                    ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}:${TAG}
                """
            }
        }

        stage('Push to ECR') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', 
                            credentialsId: 'ACCOUNT-CREDENTIAL']]) {
                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} | \\
                        docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                        docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}:${TAG}
                    """
                }
            }
        }

        stage('Post-Push Image Scan') {
            when { expression { return env.BRANCH_NAME == 'main' } }
            steps {
                sh """
                    trivy image --timeout 30m --exit-code 0 --skip-dirs .git \\
                    --scanners vuln --format table \\
                    ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}:${TAG} > trivy-image-scan.txt
                """
            }
        }

        stage('Deploy') {
            steps {
                script {
                    if (env.DEPLOY_TYPE == 'kubernetes') {
                        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', 
                                    credentialsId: 'ACCOUNT-CREDENTIAL']]) {
                            sh """
                                aws eks update-kubeconfig --region ${AWS_REGION} --name ${CLUSTER}
                                envsubst < k8s-prod.yaml | kubectl apply -f -
                            """
                        }
                    } else if (env.DEPLOY_TYPE == 'docker-compose') {
                        sshagent(credentials: ['DEPLOY-KEY']) {
                            sh """
                                set -e
                                scp -o StrictHostKeyChecking=no ${COMPOSE_FILE} ${DEPLOY_USER}@${DEPLOY_SERVER}:${DEPLOY_PATH}/
                                scp -o StrictHostKeyChecking=no .env.staging ${DEPLOY_USER}@${DEPLOY_SERVER}:${DEPLOY_PATH}/.env.staging
                                ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} "
                                    cd ${DEPLOY_PATH}
                                    export TAG=${TAG}
                                    aws ecr get-login-password --region ${AWS_REGION} | \\
                                    docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                                    docker compose -f ${COMPOSE_FILE} down --remove-orphans
                                    docker compose -f ${COMPOSE_FILE} pull
                                    TAG=${TAG} docker compose -f ${COMPOSE_FILE} up -d
                                    docker image prune -f
                                "
                            """
                        }
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
            sh """
                docker rmi ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}:${TAG} || true
            """
        }
        success {
            echo "✅ ${env.BRANCH_NAME.toUpperCase()} Deployment Successful!"
        }
        failure {
            echo "❌ Deployment Failed for ${env.BRANCH_NAME.toUpperCase()} Branch"
            script {
                if (env.BRANCH_NAME == 'staging') {
                    sshagent(credentials: ['DEPLOY-KEY']) {
                        sh '''
                            ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} "
                                cd ${DEPLOY_PATH}
                                docker compose -f ${COMPOSE_FILE} logs --tail=50 || true
                            "
                        '''.stripIndent()
                    }
                }
            }
        }
    }
}