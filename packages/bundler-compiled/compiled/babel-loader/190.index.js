"use strict";
exports.id = 190;
exports.ids = [190];
exports.modules = {

/***/ 342:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


const { sep: DEFAULT_SEPARATOR } = __webpack_require__(1017)

const determineSeparator = paths => {
  for (const path of paths) {
    const match = /(\/|\\)/.exec(path)
    if (match !== null) return match[0]
  }

  return DEFAULT_SEPARATOR
}

module.exports = function commonPathPrefix (paths, sep = determineSeparator(paths)) {
  const [first = '', ...remaining] = paths
  if (first === '' || remaining.length === 0) return ''

  const parts = first.split(sep)

  let endOfPrefix = parts.length
  for (const path of remaining) {
    const compare = path.split(sep)
    for (let i = 0; i < endOfPrefix; i++) {
      if (compare[i] !== parts[i]) {
        endOfPrefix = i
      }
    }

    if (endOfPrefix === 0) return ''
  }

  const prefix = parts.slice(0, endOfPrefix).join(sep)
  return prefix.endsWith(sep) ? prefix : prefix + sep
}


/***/ }),

/***/ 190:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ findCacheDirectory; }
});

// EXTERNAL MODULE: external "node:process"
var external_node_process_ = __webpack_require__(7742);
// EXTERNAL MODULE: external "node:path"
var external_node_path_ = __webpack_require__(9411);
// EXTERNAL MODULE: external "node:fs"
var external_node_fs_ = __webpack_require__(7561);
// EXTERNAL MODULE: ../../node_modules/.pnpm/common-path-prefix@3.0.0/node_modules/common-path-prefix/index.js
var common_path_prefix = __webpack_require__(342);
// EXTERNAL MODULE: external "node:url"
var external_node_url_ = __webpack_require__(3020);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/p-locate@6.0.0/node_modules/p-locate/index.js


class EndError extends Error {
	constructor(value) {
		super();
		this.value = value;
	}
}

// The input can also be a promise, so we await it.
const testElement = async (element, tester) => tester(await element);

// The input can also be a promise, so we `Promise.all()` them both.
const finder = async element => {
	const values = await Promise.all(element);
	if (values[1] === true) {
		throw new EndError(values[0]);
	}

	return false;
};

async function p_locate_pLocate(
	iterable,
	tester,
	{
		concurrency = Number.POSITIVE_INFINITY,
		preserveOrder = true,
	} = {},
) {
	const limit = pLimit(concurrency);

	// Start all the promises concurrently with optional limit.
	const items = [...iterable].map(element => [element, limit(testElement, element, tester)]);

	// Check the promises either serially or concurrently.
	const checkLimit = pLimit(preserveOrder ? 1 : Number.POSITIVE_INFINITY);

	try {
		await Promise.all(items.map(element => checkLimit(finder, element)));
	} catch (error) {
		if (error instanceof EndError) {
			return error.value;
		}

		throw error;
	}
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/locate-path@7.2.0/node_modules/locate-path/index.js






const typeMappings = {
	directory: 'isDirectory',
	file: 'isFile',
};

function checkType(type) {
	if (Object.hasOwnProperty.call(typeMappings, type)) {
		return;
	}

	throw new Error(`Invalid type specified: ${type}`);
}

const matchType = (type, stat) => stat[typeMappings[type]]();

const toPath = urlOrPath => urlOrPath instanceof URL ? (0,external_node_url_.fileURLToPath)(urlOrPath) : urlOrPath;

async function locate_path_locatePath(
	paths,
	{
		cwd = process.cwd(),
		type = 'file',
		allowSymlinks = true,
		concurrency,
		preserveOrder,
	} = {},
) {
	checkType(type);
	cwd = toPath(cwd);

	const statFunction = allowSymlinks ? fsPromises.stat : fsPromises.lstat;

	return pLocate(paths, async path_ => {
		try {
			const stat = await statFunction(path.resolve(cwd, path_));
			return matchType(type, stat);
		} catch {
			return false;
		}
	}, {concurrency, preserveOrder});
}

function locatePathSync(
	paths,
	{
		cwd = external_node_process_.cwd(),
		type = 'file',
		allowSymlinks = true,
	} = {},
) {
	checkType(type);
	cwd = toPath(cwd);

	const statFunction = allowSymlinks ? external_node_fs_.statSync : external_node_fs_.lstatSync;

	for (const path_ of paths) {
		try {
			const stat = statFunction(external_node_path_.resolve(cwd, path_), {
				throwIfNoEntry: false,
			});

			if (!stat) {
				continue;
			}

			if (matchType(type, stat)) {
				return path_;
			}
		} catch {}
	}
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/path-exists@5.0.0/node_modules/path-exists/index.js


async function pathExists(path) {
	try {
		await fsPromises.access(path);
		return true;
	} catch {
		return false;
	}
}

function pathExistsSync(path) {
	try {
		fs.accessSync(path);
		return true;
	} catch {
		return false;
	}
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/find-up@6.3.0/node_modules/find-up/index.js




const find_up_toPath = urlOrPath => urlOrPath instanceof URL ? (0,external_node_url_.fileURLToPath)(urlOrPath) : urlOrPath;

const findUpStop = Symbol('findUpStop');

async function findUpMultiple(name, options = {}) {
	let directory = path.resolve(find_up_toPath(options.cwd) || '');
	const {root} = path.parse(directory);
	const stopAt = path.resolve(directory, options.stopAt || root);
	const limit = options.limit || Number.POSITIVE_INFINITY;
	const paths = [name].flat();

	const runMatcher = async locateOptions => {
		if (typeof name !== 'function') {
			return locatePath(paths, locateOptions);
		}

		const foundPath = await name(locateOptions.cwd);
		if (typeof foundPath === 'string') {
			return locatePath([foundPath], locateOptions);
		}

		return foundPath;
	};

	const matches = [];
	// eslint-disable-next-line no-constant-condition
	while (true) {
		// eslint-disable-next-line no-await-in-loop
		const foundPath = await runMatcher({...options, cwd: directory});

		if (foundPath === findUpStop) {
			break;
		}

		if (foundPath) {
			matches.push(path.resolve(directory, foundPath));
		}

		if (directory === stopAt || matches.length >= limit) {
			break;
		}

		directory = path.dirname(directory);
	}

	return matches;
}

function findUpMultipleSync(name, options = {}) {
	let directory = external_node_path_.resolve(find_up_toPath(options.cwd) || '');
	const {root} = external_node_path_.parse(directory);
	const stopAt = options.stopAt || root;
	const limit = options.limit || Number.POSITIVE_INFINITY;
	const paths = [name].flat();

	const runMatcher = locateOptions => {
		if (typeof name !== 'function') {
			return locatePathSync(paths, locateOptions);
		}

		const foundPath = name(locateOptions.cwd);
		if (typeof foundPath === 'string') {
			return locatePathSync([foundPath], locateOptions);
		}

		return foundPath;
	};

	const matches = [];
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const foundPath = runMatcher({...options, cwd: directory});

		if (foundPath === findUpStop) {
			break;
		}

		if (foundPath) {
			matches.push(external_node_path_.resolve(directory, foundPath));
		}

		if (directory === stopAt || matches.length >= limit) {
			break;
		}

		directory = external_node_path_.dirname(directory);
	}

	return matches;
}

async function find_up_findUp(name, options = {}) {
	const matches = await findUpMultiple(name, {...options, limit: 1});
	return matches[0];
}

function findUpSync(name, options = {}) {
	const matches = findUpMultipleSync(name, {...options, limit: 1});
	return matches[0];
}



;// CONCATENATED MODULE: ../../node_modules/.pnpm/pkg-dir@7.0.0/node_modules/pkg-dir/index.js



async function packageDirectory({cwd} = {}) {
	const filePath = await findUp('package.json', {cwd});
	return filePath && path.dirname(filePath);
}

function packageDirectorySync({cwd} = {}) {
	const filePath = findUpSync('package.json', {cwd});
	return filePath && external_node_path_.dirname(filePath);
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/find-cache-dir@4.0.0/node_modules/find-cache-dir/index.js






const {env, cwd} = external_node_process_;

const isWritable = path => {
	try {
		external_node_fs_.accessSync(path, external_node_fs_.constants.W_OK);
		return true;
	} catch {
		return false;
	}
};

function useDirectory(directory, options) {
	if (options.create) {
		external_node_fs_.mkdirSync(directory, {recursive: true});
	}

	if (options.thunk) {
		return (...arguments_) => external_node_path_.join(directory, ...arguments_);
	}

	return directory;
}

function getNodeModuleDirectory(directory) {
	const nodeModules = external_node_path_.join(directory, 'node_modules');

	if (
		!isWritable(nodeModules)
			&& (external_node_fs_.existsSync(nodeModules) || !isWritable(external_node_path_.join(directory)))
	) {
		return;
	}

	return nodeModules;
}

function findCacheDirectory(options = {}) {
	if (env.CACHE_DIR && !['true', 'false', '1', '0'].includes(env.CACHE_DIR)) {
		return useDirectory(external_node_path_.join(env.CACHE_DIR, options.name), options);
	}

	let {cwd: directory = cwd()} = options;

	if (options.files) {
		directory = common_path_prefix(options.files.map(file => external_node_path_.resolve(directory, file)));
	}

	directory = packageDirectorySync({cwd: directory});

	if (!directory) {
		return;
	}

	const nodeModules = getNodeModuleDirectory(directory);
	if (!nodeModules) {
		return;
	}

	return useDirectory(external_node_path_.join(directory, 'node_modules', '.cache', options.name), options);
}


/***/ })

};
;