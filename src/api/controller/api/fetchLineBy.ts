export default (ctx: any) => (fieldName: any, value: any) =>
    value
        ? ctx.dataset.findBy(fieldName, value).then((line: any) =>
              line
                  ? {
                        ...line,
                        uri: `uri to ${fieldName}: ${value}`,
                    }
                  : null,
          )
        : null;
