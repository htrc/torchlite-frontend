#!/bin/bash

# Config
ENVSH_ENV="${ENVSH_ENV:-"./.env"}"
ENVSH_PREFIX="${ENVSH_PREFIX:-"NEXT_PUBLIC_"}"
ENVSH_PREFIX_STRIP="${ENVSH_PREFIX_STRIP:-true}"

# Can be `window.__env = {` or `const ENV = {` or whatever you want
ENVSH_PREPEND="${ENVSH_PREPEND:-"window.__env = {"}"
ENVSH_APPEND="${ENVSH_APPEND:-"}"}"
ENVSH_OUTPUT="${ENVSH_OUTPUT:-"./public/__env.js"}"

[ -f "$ENVSH_ENV" ] && INPUT="$ENVSH_ENV" || INPUT=/dev/null

echo "Injecting the following public environment variables into ${ENVSH_OUTPUT}:"

# Add assignment
echo "$ENVSH_PREPEND" >"$ENVSH_OUTPUT"

gawk -v PREFIX="$ENVSH_PREFIX" -v STRIP_PREFIX="$ENVSH_PREFIX_STRIP" '
BEGIN {
   OFS=": ";
   FS="=";
   PATTERN="^" PREFIX;

   for (v in ENVIRON)
      if (v ~ PATTERN)
         vars[v] = ENVIRON[v]
}

$0 ~ PATTERN {
   v = $2;

   for (i = 3; i <= NF; i++)
      v = v FS $i;

   vars[$1] = (vars[$1] ? vars[$1] : v);
}

END {
   for (v in vars) {
      val = vars[v];
      switch (val) {
         case /^true$/:
            break;

         case /^false$/:
            break;

         case /^'"'.*'"'$/:
            break;

         case /^".*"$/:
            break;

         case /^[[:digit:]]+$/:
            break;

         default:
            val = "\"" val "\"";
            break;
      }

      val = val ","

      if (STRIP_PREFIX == "true" || STRIP_PREFIX == "1")
         v = gensub(PATTERN, "", 1, v)

      print v, val;
   }
}
' "$INPUT" | tee -a "$ENVSH_OUTPUT"

echo "$ENVSH_APPEND" >>"$ENVSH_OUTPUT"

# Accepting commands (for Docker)
exec "$@"
