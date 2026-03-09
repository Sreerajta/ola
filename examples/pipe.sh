#!/usr/bin/env bash
# Pipe HTML from curl into ola
curl -s https://en.wikipedia.org/wiki/Octopus | ola --json | head -20
