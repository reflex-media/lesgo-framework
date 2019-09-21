#!/bin/bash

###############################################################################
#                                                                             #
# INITIALIZE EVERYTHING                                                       #
#                                                                             #
###############################################################################

usage="$(basename "$0") [-f] [-s] [-t] [-h] -- script to deploy serverless functions

where:
    -t      define the type of action to be taken (deploy, invoke, logs)
    -f      specify function to involve
    -s      specify stage (e.g; dev, stage, prod)
    -h      show this help text"

# arg options
DEPLOY=0;       # serverless deploy
INVOKE=0;       # serverless invoke of specific function
LOGS=0;         # serverless stream log of specific function
FUNCTION='';    # specify function to involve
STAGE='';       # deploy specific stage/environment

# parse the options
while getopts "hs:f:t:" OPT ; do
  case ${OPT} in
    f) FUNCTION=${OPTARG} ;;
    s) STAGE=${OPTARG} ;;
    t)
        if [ ${OPTARG} == "deploy" ]; then
            DEPLOY=1;
        elif [ ${OPTARG} == "invoke" ]; then
            INVOKE=1;
        elif [ ${OPTARG} == "logs" ]; then
            LOGS=1;
        else
            echo "Incorrect arguments supplied for ${OPT}"
            exit 1
        fi;;
    h)
        echo "${usage}"
        exit 0
        ;;
    *)
        echo "${usage}"
        exit 1
        ;;
  esac
done

# Set envfile to reference from
ENVFILE=${STAGE}

# rewrite stage names
if [[ ${STAGE} == "production" ]]; then
    STAGE="prod"
elif [[ ${STAGE} == "prod" ]]; then
    ENVFILE="production"
elif [[ ${STAGE} == "staging" ]]; then
    STAGE="stage"
elif [[ ${STAGE} == "stage" ]]; then
    ENVFILE="staging"
elif [[ ${STAGE} == "development" ]]; then
    STAGE="dev"
elif [[ ${STAGE} == "dev" ]]; then
    ENVFILE="development"
fi

# Check if local env file exists
FILE=config/environments/.env.${ENVFILE}.local
if [ -f "$FILE" ]; then
    ENVFILE=${ENVFILE}.local
fi

# color codes
RED='\033[0;31m';
GREEN='\033[0;32m';
ORANGE='\033[0;33m';
BLUE='\033[0;34m';
PURPLE='\033[0;35m';
CYAN='\033[0;36m';
YELLOW='\033[1;33m';
WHITE='\033[1;37m';
NC='\033[0m';

###############################################################################
#                                                                             #
# FUNCTION DECLARATIONS                                                       #
#                                                                             #
###############################################################################

function deploy_func_check ()
{
    if [[ ${STAGE} == "prod" ]]; then
        prompt_confirmation_deploy_function
    else
        deploy_func
    fi
}

function deploy_func ()
{
    echo -e "${YELLOW}Deploying ${FUNCTION} to ${STAGE}${NC}"
    sls deploy -f ${FUNCTION} --stage ${STAGE} --env ${ENVFILE}
}

function prompt_confirmation_deploy_all ()
{
    while true; do
        read -p "Confirm deploy service to ${STAGE} with .env.${ENVFILE}? [Y|N] " yn
        case ${yn} in
            [Yy] | yes | Yes | YES ) deploy_full; break;;
            [Nn] | no | No | NO ) echo -e "${YELLOW}Cancelled deploying service to [${STAGE}]${NC}"; exit;;
            * ) echo -e "${PURPLE}Please answer yes or no.${NC}";;
        esac
    done
}

function prompt_confirmation_deploy_function ()
{
    while true; do
        read -p "Confirm deploy function ${FUNCTION} to ${STAGE} with .env.${ENVFILE}? [Y|N] " yn
        case ${yn} in
            [Yy] | yes | Yes | YES ) deploy_func; break;;
            [Nn] | no | No | NO ) echo -e "${YELLOW}Cancelled deploying function ${FUNCTION} to [${STAGE}]${NC}"; exit;;
            * ) echo -e "${PURPLE}Please answer yes or no.${NC}";;
        esac
    done
}

function deploy_full ()
{
    echo -e "${YELLOW}Deploying service to ${STAGE}${NC}"
    sls deploy --stage ${STAGE} --env ${ENVFILE}
}

function invoke_func ()
{
    echo -e "${YELLOW}Invoking function ${FUNCTION} on ${STAGE}${NC}"
    sls invoke -f ${FUNCTION} --stage ${STAGE} --env ${ENVFILE} -l
}

function log_stream_func ()
{
    echo -e "${YELLOW}Log Streaming function ${FUNCTION} on ${STAGE}${NC}"
    sls logs -f ${FUNCTION} --stage ${STAGE} --env ${ENVFILE} -t
}

###############################################################################
#                                                                             #
# RUN STUFF                                                                   #
#                                                                             #
###############################################################################

if [ -n "$STAGE" ]; then
    if [[ ${STAGE} == "dev" ]] || [[ ${STAGE} == "stage" ]] || [[ ${STAGE} == "prod" ]]; then
        if [ ${INVOKE} -eq 1 ]; then
            if [ -n "$FUNCTION" ]; then
                invoke_func
            else
                echo -e "${RED}Function [-f] is required to invoke.${NC}"
                exit 1;
            fi
        elif [ ${LOGS} -eq 1 ]; then
            if [ -n "$FUNCTION" ]; then
                log_stream_func
            else
                echo -e "${RED}Function [-f] is required to stream logs.${NC}"
                exit 1;
            fi
        elif [ ${DEPLOY} -eq 1 ]; then
            if [ -n "$FUNCTION" ]; then
                deploy_func_check
            else
                prompt_confirmation_deploy_all
            fi
        else
          echo -e "${RED}Invalid Task [-t] supplied. Only 'deploy', 'invoke', 'logs' are allowed.${NC}"
          exit 1;
        fi
    else
        echo -e "${RED}Invalid Stage [-s] supplied. Only 'dev', 'development', 'stage', 'staging', 'prod', 'production' are allowed.${NC}"
        exit 1;
    fi
else
    echo -e "${RED}Stage [-s] is required.${NC}"
    exit 1;
fi

###############################################################################
#                                                                             #
# ALL DONE                                                                    #
#                                                                             #
###############################################################################
