// Mock database to replace Firebase Admin
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data.json');
let data: any = {};
if (fs.existsSync(dbPath)) {
  data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function save() {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

const createSnapshot = (docsArray: any[]) => ({
  docs: docsArray,
  forEach: (cb: any) => docsArray.forEach(cb)
});

export default {
  collection: (col: string) => {
    if (!data[col]) data[col] = {};
    return {
      doc: (id?: string) => {
        const docId = id || Math.random().toString(36).slice(2);
        if (!data[col][docId]) data[col][docId] = {};
        
        const docRef = {
          get: async () => ({
            exists: !!data[col][docId] && Object.keys(data[col][docId]).length > 0,
            data: () => data[col][docId],
            id: docId,
            ref: docRef
          }),
          set: async (val: any, opts?: any) => {
            if (opts?.merge) {
              data[col][docId] = { ...data[col][docId], ...val };
            } else {
              data[col][docId] = val;
            }
            save();
          },
          update: async (val: any) => {
            data[col][docId] = { ...data[col][docId], ...val };
            save();
          },
          collection: (subcol: string) => {
            if (!data[col][docId][subcol]) data[col][docId][subcol] = {};
            
            const subcolRef = {
              doc: (subId?: string) => {
                const sId = subId || Math.random().toString(36).slice(2);
                const subDocRef = {
                  get: async () => ({
                    exists: !!data[col][docId][subcol][sId] && Object.keys(data[col][docId][subcol][sId]).length > 0,
                    data: () => data[col][docId][subcol][sId],
                    id: sId,
                    ref: subDocRef
                  }),
                  set: async (val: any, opts?: any) => {
                    if (opts?.merge) {
                      data[col][docId][subcol][sId] = { ...data[col][docId][subcol][sId], ...val };
                    } else {
                      data[col][docId][subcol][sId] = val;
                    }
                    save();
                  },
                  update: async (val: any) => {
                    data[col][docId][subcol][sId] = { ...data[col][docId][subcol][sId], ...val };
                    save();
                  },
                  delete: async () => {
                    delete data[col][docId][subcol][sId];
                    save();
                  }
                };
                return subDocRef;
              },
              get: async () => {
                const docs = Object.keys(data[col][docId][subcol]).map(k => ({
                  id: k,
                  data: () => data[col][docId][subcol][k],
                  ref: { delete: async () => { delete data[col][docId][subcol][k]; save(); } }
                }));
                return createSnapshot(docs);
              },
              where: (field: string, op: string, val: any) => {
                return {
                  get: async () => {
                    const docs = Object.keys(data[col][docId][subcol]).filter(k => {
                      if (op === '==') return data[col][docId][subcol][k][field] === val;
                      return false;
                    }).map(k => ({
                      id: k,
                      data: () => data[col][docId][subcol][k],
                      ref: { delete: async () => { delete data[col][docId][subcol][k]; save(); } }
                    }));
                    return createSnapshot(docs);
                  }
                };
              },
              orderBy: (field?: string, dir?: string) => {
                return {
                  limit: (num?: number) => {
                    return {
                      get: async () => {
                        const docs = Object.keys(data[col][docId][subcol]).map(k => ({
                          id: k,
                          data: () => data[col][docId][subcol][k],
                          ref: { delete: async () => { delete data[col][docId][subcol][k]; save(); } }
                        }));
                        return createSnapshot(docs);
                      }
                    };
                  },
                  get: async () => {
                    const docs = Object.keys(data[col][docId][subcol]).map(k => ({
                      id: k,
                      data: () => data[col][docId][subcol][k],
                      ref: { delete: async () => { delete data[col][docId][subcol][k]; save(); } }
                    }));
                    return createSnapshot(docs);
                  }
                };
              }
            };
            return subcolRef;
          }
        };
        return docRef;
      },
      where: (field: string, op: string, val: any) => {
        return {
          get: async () => {
            const docs = Object.keys(data[col]).filter(k => {
              if (op === '==') return data[col][k][field] === val;
              return false;
            }).map(k => ({ id: k, data: () => data[col][k], ref: { delete: async () => { delete data[col][k]; save(); } } }));
            return createSnapshot(docs);
          }
        };
      },
      orderBy: (field?: string, dir?: string) => {
         return {
           limit: (num?: number) => {
             return {
                get: async () => {
                  const docs = Object.keys(data[col]).map(k => ({ id: k, data: () => data[col][k], ref: { delete: async () => { delete data[col][k]; save(); } } }));
                  return createSnapshot(docs);
                }
             }
           },
           get: async () => {
              const docs = Object.keys(data[col]).map(k => ({ id: k, data: () => data[col][k], ref: { delete: async () => { delete data[col][k]; save(); } } }));
              return createSnapshot(docs);
           }
         }
      }
    };
  },
  runTransaction: async (cb: any) => {
    const t = {
      get: async (ref: any) => ref.get(),
      set: (ref: any, val: any, opts?: any) => ref.set(val, opts),
      update: (ref: any, val: any) => ref.update(val),
    };
    await cb(t);
  },
  batch: () => {
    return {
      set: (ref: any, val: any, opts?: any) => ref.set(val, opts),
      update: (ref: any, val: any) => ref.update(val),
      delete: (ref: any) => {
        if (ref.delete) ref.delete();
      },
      commit: async () => { save(); }
    };
  }
};
