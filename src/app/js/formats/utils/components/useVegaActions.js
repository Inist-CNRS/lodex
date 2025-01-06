import { useMemo } from 'react';
import { isAdmin } from '../../../user';

export function useVegaActions(user) {
    return useMemo(
        () =>
            isAdmin(user)
                ? {
                      export: {
                          svg: true,
                          png: true,
                      },
                      source: true,
                      compiled: true,
                      editor: true,
                  }
                : {
                      export: {
                          svg: true,
                          png: true,
                      },
                      source: false,
                      compiled: false,
                      editor: false,
                  },
        [user],
    );
}
