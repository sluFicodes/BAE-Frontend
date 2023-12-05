export interface Category {
  id?: string,
  href?: string,
  description?: string,
  isRoot?: boolean,
  parentId?: string,
  lastUpdate?: string,
  lifecycleStatus?: string,
  name: string,
  version?: string,
  validFor?: object,
  children?: Category[]
}
