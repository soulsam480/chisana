## Chisana
> an attempt to create a jotai like thing for vue 3

### status
- pre alpha

### goals
- [ ] keep API similar
- [ ] Don't complicate core
- [ ] small bundle size
- [ ] code splitting
- [ ] ...


### approach
- atoms -> ref
- createAtom -> create atom, register it, returns a unique key to retrive atom
- useAtom -> pick atom from injected global atoms registry
- only [get, set]
  - get -> inject -> pick -> maintain reactive connection
  - set -> pick -> update
- only valid inside components
- createRoot -> create registry and inject
- chisana._r -> global atoms registry -> reactive<{[key: string]: S}>()


### issues
- there is a memory leak issue i think