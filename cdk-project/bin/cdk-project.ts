#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { CdkProjectStack } from '../lib/cdk-project-stack';

const app = new App();
new CdkProjectStack(app, 'CdkProjectStack');
