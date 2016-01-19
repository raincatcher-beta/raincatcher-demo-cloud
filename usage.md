# Running WFM 2 locally

## Setup/update
Follow these steps for each of:
* wfm2-cloud
* wfm2-portal
* wfm2-mobile


1. git clone/update
2. npm install
3. list the locally installed WFM modules:
  ```bash
  $ grep fh-wfm package.json
  ```
3. for each `fh-wfm-*` npm module that is being developed, run:
  * git clone the module into a parallel folder
  * npm link that folder back into the cloud/client apps

## Running the application
Start the cloud app:
```bash
$ grunt serve
```

Start the mobile and portal apps:
```bash
$ grunt serve:local --url=http://localhost:8001
```
