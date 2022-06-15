#!/usr/bin/env bash

set -Eeuo pipefail

###############################################################################
#                                                                             #
# INITIALIZE EVERYTHING                                                       #
#                                                                             #
###############################################################################

usage="$(basename "$0") [-f] [-s] [-t] [-h] [-d] [-c] [-y] -- script to deploy serverless functions

where:
    -t      define the type of action to be taken (build, deploy, invoke, logs, destroy)
    -f      specify function to involve
    -s      specify environment (e.g; development, staging, production)
    -h      show this help text
    -l      to invoke a local function
    -d      set data parameters for invoke function
    -c      set config as per --config path-to-serverless-yml
    -y      no question/prompt for ci/cd"

# arg options
BUILD=0;                    # serverless build without deploy
DEPLOY=0;                   # serverless deploy
INVOKE=0;                   # serverless invoke of specific function
LOGS=0;                     # serverless stream log of specific function
DESTROY=0;                  # serverless remove entire service
FUNCTION='';                # specify function to involve
STAGE='';                   # deploy specific stage/environment
INVOKE_LOCAL=0;             # default to non local execution
DATA=''                     # set the data parameters for invoke function
NO_QUESTION=0;              # default to prompt
CONFIG='./serverless.yml';  # specify serverless config file to deploy, default to root

# parse the options
while getopts "lhs:f:t:d:c:y" OPT ; do
  case ${OPT} in
    f) FUNCTION=${OPTARG} ;;
    s) STAGE=${OPTARG} ;;
    t)
        if [ ${OPTARG} == "build" ]; then
            BUILD=1;
        elif [ ${OPTARG} == "deploy" ]; then
            DEPLOY=1;
        elif [ ${OPTARG} == "invoke" ]; then
            INVOKE=1;
        elif [ ${OPTARG} == "logs" ]; then
            LOGS=1;
        elif [ ${OPTARG} == "destroy" ]; then
            DESTROY=1;
        else
            echo "Incorrect arguments supplied for ${OPT}"
            exit 1
        fi;;
    l) INVOKE_LOCAL=1 ;;
    d) DATA=${OPTARG} ;;
    c) CONFIG=${OPTARG} ;;
    y) NO_QUESTION=1 ;;
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

SERVERLESS_VERSION=`npm view serverless version`
echo -e "Running Serverless version: ${SERVERLESS_VERSION}"

SERVERLESS_VERSION_NUMBER=$((${SERVERLESS_VERSION:0:1}  + 0))
LATEST_SERVERLESS_VERSION_NUMBER=3


function deploy_func_check ()
{
    if [[ ${STAGE} == "production" ]]; then
        prompt_confirmation_deploy_function
    else
        deploy_func
    fi
}

function deploy_func ()
{
    
    echo -e "${YELLOW}Deploying ${FUNCTION} to ${STAGE}${NC} using ${CONFIG}"

     if [ ${SERVERLESS_VERSION_NUMBER} -ge ${LATEST_SERVERLESS_VERSION_NUMBER} ]; then
        sls deploy function -f ${FUNCTION} --stage ${STAGE} --param="env=${ENVFILE}" --config ${CONFIG}
    else
        sls deploy  -f ${FUNCTION} --stage ${STAGE} --env ${ENVFILE} --config ${CONFIG}
    fi
}

function prompt_confirmation_deploy_all ()
{
    if [ ${NO_QUESTION} -eq 1 ]; then
        deploy_full;
    else
        while true; do
            read -p "Confirm deploy service to ${STAGE} with .env.${ENVFILE} using ${CONFIG}? [Y|N] " yn
            case ${yn} in
                [Yy] | yes | Yes | YES ) deploy_full; break;;
                [Nn] | no | No | NO ) echo -e "${YELLOW}Cancelled deploying service to [${STAGE}]${NC}"; exit;;
                * ) echo -e "${PURPLE}Please answer yes or no.${NC}";;
            esac
        done
    fi
}

function prompt_confirmation_deploy_function ()
{
    while true; do
        read -p "Confirm deploy function ${FUNCTION} to ${STAGE} with .env.${ENVFILE} using ${CONFIG}? [Y|N] " yn
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
    if [ ${SERVERLESS_VERSION_NUMBER} -ge ${LATEST_SERVERLESS_VERSION_NUMBER} ]; then
        sls deploy --stage ${STAGE} --param="env=${ENVFILE}" --config ${CONFIG}
    else
        sls deploy --stage ${STAGE} --env ${ENVFILE} --config ${CONFIG}
    fi
}

function invoke_func ()
{
    echo -e "${YELLOW}Invoking function ${FUNCTION} on ${STAGE}${NC} using ${CONFIG}"
    if [ ${INVOKE_LOCAL} == 1 ]; then

        if [ ${SERVERLESS_VERSION_NUMBER} -ge ${LATEST_SERVERLESS_VERSION_NUMBER} ]; then
            sls invoke local function -f ${FUNCTION} --stage ${STAGE} --param="env=${ENVFILE}" -d ${DATA} -l --config ${CONFIG}
        else
            sls invoke local -f ${FUNCTION} --stage ${STAGE} --env ${ENVFILE} -d ${DATA} -l --config ${CONFIG}
        fi

    else

        if [ ${SERVERLESS_VERSION_NUMBER} -ge ${LATEST_SERVERLESS_VERSION_NUMBER} ]; then
            sls invoke function -f ${FUNCTION} --stage ${STAGE} --param="env=${ENVFILE}" -d ${DATA} -l --config ${CONFIG}
        else
            sls invoke -f ${FUNCTION} --stage ${STAGE} --env ${ENVFILE} -d ${DATA} -l --config ${CONFIG}
        fi
    fi
}

function log_stream_func ()
{
    echo -e "${YELLOW}Log Streaming function ${FUNCTION} on ${STAGE}${NC} using ${CONFIG}"
    if [ ${SERVERLESS_VERSION_NUMBER} -ge ${LATEST_SERVERLESS_VERSION_NUMBER} ]; then
        sls logs function -f ${FUNCTION} --stage ${STAGE} --param="env=${ENVFILE}" -t --config ${CONFIG}
    else
        sls logs -f ${FUNCTION} --stage ${STAGE} --env ${ENVFILE} -t --config ${CONFIG}
    fi
}

function build ()
{
    echo -e "${YELLOW}Building bundle without deployment${NC} using ${CONFIG}"

    if [ ${SERVERLESS_VERSION_NUMBER} -ge ${LATEST_SERVERLESS_VERSION_NUMBER} ]; then
        sls webpack --stage ${STAGE} --param="env=${ENVFILE}" --config ${CONFIG}
    else
        sls webpack --stage ${STAGE} --env ${ENVFILE} --config ${CONFIG}
    fi
}

function prompt_confirmation_destroy_service ()
{
    while true; do
        read -p "Confirm destroy service to ${STAGE} with .env.${ENVFILE} using ${CONFIG}? Note: This action will remove entire service from AWS. Ensure no other applications are using this service. [Y|N] " yn
        case ${yn} in
            [Yy] | yes | Yes | YES ) destroy_service; break;;
            [Nn] | no | No | NO ) echo -e "${YELLOW}Cancelled destroying service to [${STAGE}]${NC}"; exit;;
            * ) echo -e "${PURPLE}Please answer yes or no.${NC}";;
        esac
    done
}

function destroy_service ()
{
    echo -e "${YELLOW}Removing service to ${STAGE}${NC}"
    sls remove --stage ${STAGE} --param="env=${ENVFILE}" --config ${CONFIG}
}

###############################################################################
#                                                                             #
# RUN STUFF                                                                   #
#                                                                             #
###############################################################################

if [ -n "$STAGE" ]; then
    # Load env
    export $(cat ./config/environments/.env.${ENVFILE} | sed 's/#.*//g' | xargs)

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
    elif [ ${BUILD} -eq 1 ]; then
        build
    elif [ ${DESTROY} -eq 1 ]; then
        prompt_confirmation_destroy_service
    else
        echo -e "${RED}Invalid Task [-t] supplied. Only 'deploy', 'invoke', 'logs' are allowed.${NC}"
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
