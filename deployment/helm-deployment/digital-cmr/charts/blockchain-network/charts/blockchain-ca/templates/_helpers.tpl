{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "blockchain-ca.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "blockchain-ca.fullname" -}}
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
{{- define "blockchain-ca.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create labels for the chart to identify the pod.
*/}}
{{- define "labels.standard" -}}
app: {{ include "blockchain-ca.name" . }}
heritage: {{ .Release.Service | quote }}
release: {{ .Release.Name | quote }}
chart: {{ include "blockchain-ca.chart" . }}
{{- end -}}

{{/*
Create index for the keystore of ca
*/}}
{{- define "ca.keystore" -}}
{{- $baseRoot := printf "certs/ca/%s/" .Values.global.org.name }}
{{- $root := printf "%s**_sk" $baseRoot}}
{{- range $path, $bytes := .Files.Glob $root}}
{{- base $path }}
{{- end }}
{{- end -}}

{{/*
Create index for the keystore of ca
*/}}
{{- define "ca.certificate" -}}
{{- $baseRoot := printf "certs/ca/%s/" .Values.global.org.name }}
{{- $root := printf "%s**.pem" $baseRoot}}
{{- range $path, $bytes := .Files.Glob $root}}
{{- base $path }}
{{- end }}
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
