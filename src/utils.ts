function renameProps(source: any, mapping: [string, string][]) {
  for (const [key, newKey] of mapping) {
    source[newKey] = source[key];
    delete source[key];
  }
}

export { renameProps };
