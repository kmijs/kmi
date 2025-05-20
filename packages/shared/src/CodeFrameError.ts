interface SourceLocation {
  s: number
  e: number
}

export class CodeFrameError extends Error {
  location: SourceLocation

  constructor(msg: string, location: SourceLocation) {
    super(msg)
    this.location = location
  }
}
