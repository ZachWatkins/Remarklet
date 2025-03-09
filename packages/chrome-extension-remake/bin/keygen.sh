#!/bin/bash
openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private.pem -out public.pem
openssl rsa -pubin -inform PEM -outform DER -in public.pem | base64 > key.txt
