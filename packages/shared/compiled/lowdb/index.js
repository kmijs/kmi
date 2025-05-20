import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
/******/ // The require scope
/******/ var __nccwpck_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__nccwpck_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__nccwpck_require__.d(__webpack_exports__, {
  "c": () => (/* reexport */ JSONFilePreset),
  "P": () => (/* reexport */ Low)
});

;// CONCATENATED MODULE: ../../node_modules/.pnpm/lowdb@7.0.1/node_modules/lowdb/lib/core/Low.js
function checkArgs(adapter, defaultData) {
    if (adapter === undefined)
        throw new Error('lowdb: missing adapter');
    if (defaultData === undefined)
        throw new Error('lowdb: missing default data');
}
class Low {
    adapter;
    data;
    constructor(adapter, defaultData) {
        checkArgs(adapter, defaultData);
        this.adapter = adapter;
        this.data = defaultData;
    }
    async read() {
        const data = await this.adapter.read();
        if (data)
            this.data = data;
    }
    async write() {
        if (this.data)
            await this.adapter.write(this.data);
    }
    async update(fn) {
        fn(this.data);
        await this.write();
    }
}
class Low_LowSync {
    adapter;
    data;
    constructor(adapter, defaultData) {
        checkArgs(adapter, defaultData);
        this.adapter = adapter;
        this.data = defaultData;
    }
    read() {
        const data = this.adapter.read();
        if (data)
            this.data = data;
    }
    write() {
        if (this.data)
            this.adapter.write(this.data);
    }
    update(fn) {
        fn(this.data);
        this.write();
    }
}

;// CONCATENATED MODULE: external "node:fs"
const external_node_fs_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:fs");
;// CONCATENATED MODULE: external "node:fs/promises"
const promises_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:fs/promises");
;// CONCATENATED MODULE: external "node:path"
const external_node_path_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:path");
;// CONCATENATED MODULE: external "node:url"
const external_node_url_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:url");
;// CONCATENATED MODULE: ../../node_modules/.pnpm/steno@4.0.2/node_modules/steno/lib/index.js



// Returns a temporary file
// Example: for /some/file will return /some/.file.tmp
function getTempFilename(file) {
    const f = file instanceof URL ? (0,external_node_url_namespaceObject.fileURLToPath)(file) : file.toString();
    return (0,external_node_path_namespaceObject.join)((0,external_node_path_namespaceObject.dirname)(f), `.${(0,external_node_path_namespaceObject.basename)(f)}.tmp`);
}
// Retries an asynchronous operation with a delay between retries and a maximum retry count
async function retryAsyncOperation(fn, maxRetries, delayMs) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        }
        catch (error) {
            if (i < maxRetries - 1) {
                await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
            else {
                throw error; // Rethrow the error if max retries reached
            }
        }
    }
}
class Writer {
    #filename;
    #tempFilename;
    #locked = false;
    #prev = null;
    #next = null;
    #nextPromise = null;
    #nextData = null;
    // File is locked, add data for later
    #add(data) {
        // Only keep most recent data
        this.#nextData = data;
        // Create a singleton promise to resolve all next promises once next data is written
        this.#nextPromise ||= new Promise((resolve, reject) => {
            this.#next = [resolve, reject];
        });
        // Return a promise that will resolve at the same time as next promise
        return new Promise((resolve, reject) => {
            this.#nextPromise?.then(resolve).catch(reject);
        });
    }
    // File isn't locked, write data
    async #write(data) {
        // Lock file
        this.#locked = true;
        try {
            // Atomic write
            await (0,promises_namespaceObject.writeFile)(this.#tempFilename, data, 'utf-8');
            await retryAsyncOperation(async () => {
                await (0,promises_namespaceObject.rename)(this.#tempFilename, this.#filename);
            }, 10, 100);
            // Call resolve
            this.#prev?.[0]();
        }
        catch (err) {
            // Call reject
            if (err instanceof Error) {
                this.#prev?.[1](err);
            }
            throw err;
        }
        finally {
            // Unlock file
            this.#locked = false;
            this.#prev = this.#next;
            this.#next = this.#nextPromise = null;
            if (this.#nextData !== null) {
                const nextData = this.#nextData;
                this.#nextData = null;
                await this.write(nextData);
            }
        }
    }
    constructor(filename) {
        this.#filename = filename;
        this.#tempFilename = getTempFilename(filename);
    }
    async write(data) {
        return this.#locked ? this.#add(data) : this.#write(data);
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/lowdb@7.0.1/node_modules/lowdb/lib/adapters/node/TextFile.js




class TextFile {
    #filename;
    #writer;
    constructor(filename) {
        this.#filename = filename;
        this.#writer = new Writer(filename);
    }
    async read() {
        let data;
        try {
            data = await (0,promises_namespaceObject.readFile)(this.#filename, 'utf-8');
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                return null;
            }
            throw e;
        }
        return data;
    }
    write(str) {
        return this.#writer.write(str);
    }
}
class TextFile_TextFileSync {
    #tempFilename;
    #filename;
    constructor(filename) {
        this.#filename = filename;
        const f = filename.toString();
        this.#tempFilename = path.join(path.dirname(f), `.${path.basename(f)}.tmp`);
    }
    read() {
        let data;
        try {
            data = readFileSync(this.#filename, 'utf-8');
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                return null;
            }
            throw e;
        }
        return data;
    }
    write(str) {
        writeFileSync(this.#tempFilename, str);
        renameSync(this.#tempFilename, this.#filename);
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/lowdb@7.0.1/node_modules/lowdb/lib/adapters/node/DataFile.js

class DataFile {
    #adapter;
    #parse;
    #stringify;
    constructor(filename, { parse, stringify, }) {
        this.#adapter = new TextFile(filename);
        this.#parse = parse;
        this.#stringify = stringify;
    }
    async read() {
        const data = await this.#adapter.read();
        if (data === null) {
            return null;
        }
        else {
            return this.#parse(data);
        }
    }
    write(obj) {
        return this.#adapter.write(this.#stringify(obj));
    }
}
class DataFile_DataFileSync {
    #adapter;
    #parse;
    #stringify;
    constructor(filename, { parse, stringify, }) {
        this.#adapter = new TextFileSync(filename);
        this.#parse = parse;
        this.#stringify = stringify;
    }
    read() {
        const data = this.#adapter.read();
        if (data === null) {
            return null;
        }
        else {
            return this.#parse(data);
        }
    }
    write(obj) {
        this.#adapter.write(this.#stringify(obj));
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/lowdb@7.0.1/node_modules/lowdb/lib/adapters/node/JSONFile.js

class JSONFile extends DataFile {
    constructor(filename) {
        super(filename, {
            parse: JSON.parse,
            stringify: (data) => JSON.stringify(data, null, 2),
        });
    }
}
class JSONFile_JSONFileSync extends (/* unused pure expression or super */ null && (DataFileSync)) {
    constructor(filename) {
        super(filename, {
            parse: JSON.parse,
            stringify: (data) => JSON.stringify(data, null, 2),
        });
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/lowdb@7.0.1/node_modules/lowdb/lib/adapters/Memory.js
class Memory {
    #data = null;
    read() {
        return Promise.resolve(this.#data);
    }
    write(obj) {
        this.#data = obj;
        return Promise.resolve();
    }
}
class Memory_MemorySync {
    #data = null;
    read() {
        return this.#data || null;
    }
    write(obj) {
        this.#data = obj;
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/lowdb@7.0.1/node_modules/lowdb/lib/presets/node.js



async function JSONFilePreset(filename, defaultData) {
    const adapter = process.env.NODE_ENV === 'test'
        ? new Memory()
        : new JSONFile(filename);
    const db = new Low(adapter, defaultData);
    await db.read();
    return db;
}
function JSONFileSyncPreset(filename, defaultData) {
    const adapter = process.env.NODE_ENV === 'test'
        ? new MemorySync()
        : new JSONFileSync(filename);
    const db = new LowSync(adapter, defaultData);
    db.read();
    return db;
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/lowdb@7.0.1/node_modules/lowdb/lib/node.js





;// CONCATENATED MODULE: ./bundles/lowdb/bundle.mjs





var __webpack_exports__JSONFilePreset = __webpack_exports__.c;
var __webpack_exports__Low = __webpack_exports__.P;
export { __webpack_exports__JSONFilePreset as JSONFilePreset, __webpack_exports__Low as Low };
