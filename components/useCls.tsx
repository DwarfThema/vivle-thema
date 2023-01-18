export function UseCls(...classnames: string[]) {
  return classnames.join(" ");
}
// [1,2,3] = join("/") => "1/2/3"
