import { useMemo } from 'react';
import { isAdmin } from '../../../user/reducer';

// @ts-expect-error TS7006
export function useVegaActions(user) {
    return useMemo(
        () =>
            isAdmin(user)
                ? {
                      export: {
                          svg: true,
                          png: true,
                          csv: true,
                      },
                      source: true,
                      compiled: true,
                      editor: true,
                  }
                : {
                      export: {
                          svg: true,
                          png: true,
                          csv: true,
                      },
                      source: false,
                      compiled: false,
                      editor: false,
                  },
        [user],
    );
}
