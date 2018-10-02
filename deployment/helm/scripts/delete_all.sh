#!/bin/sh

helm ls --short | xargs -L1 helm delete