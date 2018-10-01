{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "blockchain-orderer.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "blockchain-orderer.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "blockchain-orderer.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create ports for the service.
*/}}
{{- define "service.ports" -}}
{{- range $key, $value := .Values.service.ports }}
- protocol: {{ $value.protocol }}
  port: {{ $value.port }}
  nodePort: {{ $value.nodePort }}
  name: {{ $value.name }}
{{- end -}}
{{- end -}}

{{/*
Create index for the secrets of orderers
*/}}
{{- define "secret.orderer.index" -}}
{{- $baseRoot := printf "environment/crypto-config/ordererOrganizations/%s/orderers/orderer.%s/" .Values.global.org.name .Values.global.org.name }}
{{- $root := printf "%s**" $baseRoot}}
{{- $adminCertificate := printf "Admin@%s-cert.pem" .Values.global.org.name }}
{{- $adminTempCert := printf "admin-%s-cert.pem" .Values.global.org.name }}
{{- range $path, $bytes := .Files.Glob $root}}
- key: {{base $path }}
  path: {{$path | trimPrefix $baseRoot | replace $adminTempCert $adminCertificate}}
{{- end }}
{{- end -}}