targetScope = 'resourceGroup'

// REVIEW ONLY: run what-if and review all changes before any deployment.
// These declarations intentionally do not manage app settings, connection
// strings, most site config, authentication, deployment history, or SQL resources.
// Omission is not proof of preservation; provider defaults can still cause drift.
@description('Location of the existing App Service resources.')
param location string = 'westus2'

@description('Existing Linux frontend plan name.')
param frontendPlanName string = 'ASP-CroweQuestGroup-87a7'

@description('Existing Windows API plan name.')
param apiPlanName string = 'ASP-CroweQuestGroup-bda5'

@description('Existing frontend App Service name.')
param frontendName string = 'CroweQuest'

@description('Existing API App Service name.')
param apiName string = 'CroweQuestWebAPI'

// Supply the complete current tag collections securely at validation time.
@secure()
@description('Complete existing frontend tags, including monitoring links.')
param frontendTags object

@secure()
@description('Complete existing API tags, including monitoring links.')
param apiTags object

resource frontendPlan 'Microsoft.Web/serverfarms@2024-11-01' = {
  name: frontendPlanName
  location: location
  kind: 'linux'
  sku: {
    name: 'F1'
    tier: 'Free'
    capacity: 1
  }
  properties: {
    reserved: true
    perSiteScaling: false
    zoneRedundant: false
  }
}

resource apiPlan 'Microsoft.Web/serverfarms@2024-11-01' = {
  name: apiPlanName
  location: location
  kind: 'app'
  sku: {
    name: 'F1'
    tier: 'Free'
    capacity: 0
  }
  properties: {
    reserved: false
    perSiteScaling: false
    zoneRedundant: false
  }
}

resource frontend 'Microsoft.Web/sites@2024-11-01' = {
  name: frontendName
  location: location
  kind: 'app,linux'
  tags: frontendTags
  properties: {
    serverFarmId: frontendPlan.id
    httpsOnly: true
    clientAffinityEnabled: false
    clientCertEnabled: false
    publicNetworkAccess: 'Enabled'
    siteConfig: {
      localMySqlEnabled: false
      netFrameworkVersion: 'v4.0'
    }
  }
}

resource api 'Microsoft.Web/sites@2024-11-01' = {
  name: apiName
  location: location
  kind: 'app'
  tags: apiTags
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: apiPlan.id
    httpsOnly: true
    clientAffinityEnabled: true
    clientCertEnabled: false
    publicNetworkAccess: 'Enabled'
    siteConfig: {
      localMySqlEnabled: false
      netFrameworkVersion: 'v2.0'
    }
  }
}
