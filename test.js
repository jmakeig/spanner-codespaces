#!/usr/bin/env node

// https://stackoverflow.com/questions/55377103/can-i-import-the-node-postgres-module-pg-or-is-it-commonjs-only#comment131338205_55378800
import pg from 'pg'

const { Pool } = pg
const pool = new Pool();

console.log(pool);