//a small helper to translate our Tailwind-inspired classes into actual data
// parsers/classname-parser/tailwind-infra.ts

export function parseClassName(className: string): any {
  const props: any = {};
  
  // Split the string "engine-postgres storage-100gb" into an array of words
  const classes = className.split(' ').filter(Boolean);

  classes.forEach(cls => {
    // Database Props
    if (cls.startsWith('engine-')) props.engine = cls.replace('engine-', '');
    if (cls.startsWith('storage-')) {
      // Extract the number using a regular expression
      const match = cls.match(/\d+/);
      props.storageGb = match ? parseInt(match[0], 10) : 0;
    }
    if (cls === 'multi-az') props.multiAz = true;

    // VPC Props
    if (cls.startsWith('cidr-')) props.cidrBlock = cls.replace('cidr-', '');
    if (cls.startsWith('region-')) props.region = cls.replace('region-', '');
  });

  return props;
}