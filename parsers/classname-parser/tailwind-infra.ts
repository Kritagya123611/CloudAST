export function parseClassName(className: string): any {
  const props: any = {};
  const classes = className.split(' ').filter(Boolean);

  classes.forEach(cls => {
    if (cls.startsWith('engine-')) props.engine = cls.replace('engine-', '');
    if (cls.startsWith('storage-')) {
      const match = cls.match(/\d+/);
      props.storageGb = match ? parseInt(match[0], 10) : 0;
    }
    if (cls === 'multi-az') props.multiAz = true;
    if (cls.startsWith('cidr-')) props.cidrBlock = cls.replace('cidr-', '');
    if (cls.startsWith('region-')) props.region = cls.replace('region-', '');
  });

  return props;
}