#!/bin/bash

CERT_DIR="./cert"

# Crea la carpeta si no existe
mkdir -p "$CERT_DIR"

# Genera certificados autofirmados
openssl req -nodes -new -x509 \
  -keyout "$CERT_DIR/key.pem" \
  -out "$CERT_DIR/cert.pem" \
  -days 365 \
  -subj "/C=CU/ST=Habana/L=Habana/O=DevApp/CN=localhost"

echo "✅ Certificados generados en $CERT_DIR/"
