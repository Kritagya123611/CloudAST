/*
This is the heavy lifter. Babel will read the JSX, find the <VPC> or <RDS> tags, 
grab the className, pass it to our helper above, and save it to our blueprint.
*/ 
import * as babel from '@babel/core';
import { parseClassName } from '../classname-parser/tailwind-infra';
import { InfrastructureState, AWSResource } from '../../core/ast-types';