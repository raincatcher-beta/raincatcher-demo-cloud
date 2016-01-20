# Running WFM 2 locally

## Setup/update
The WFM github repos are in the _feedhenry-staff_ organisation:
> https://github.com/feedhenry-staff/?utf8=%E2%9C%93&query=wfm

Follow these steps for each of:
* wfm-cloud
* wfm-portal
* wfm-mobile
* wfm-auth


1. git clone/update
2. npm install
3. list the locally installed WFM modules:
  ```bash
  $ grep fh-wfm package.json
  ```
3. for each `fh-wfm-*` npm module that is being developed, run:
  * git clone the module into a parallel folder
  * npm link that folder back into the cloud/client apps:
```bash
$ grep fh-wfm package.json | cut -d':' -f1 | tr -d ' "' | sed 's/fh-//' | xargs -I {} npm link ../modules/{}
```

The resulting directory structure should look like this:
```
├── modules
│   ├── wfm-appform
│   ├── wfm-component-signature
│   ├── wfm-mediator
│   ├── wfm-risk-assessment
│   ├── wfm-sync
│   ├── wfm-template-build
│   ├── wfm-user
│   ├── wfm-vehicle-inspection
│   ├── wfm-workflow
│   └── wfm-workorder
├── wfm-auth
│   └── ...
├── wfm-cloud
│   └── ...
├── wfm-mobile
│   └── ...
└── wfm-portal
    └── ...
```

## Running the application
Start mongo in a seperate terminal:
```bash
mongod --dbpath ~/workspace/wfm/data/
```

Start the cloud and auth apps:
```bash
$ grunt serve
```

Start the mobile and portal apps:
```bash
$ grunt serve:local --url=http://localhost:8001
```
