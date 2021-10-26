## Black Duck Critical and High Vulernability Check ##  

Uses the service connection established for Black Duck task to perform additional API calls to determine if any CRITICAL or HIGH security risks were introduced into the product. If a critical or high security error is detected it will fail the build.

<br>

``` 
steps:
- task: ProductTech.alle-bd-sec-scan.alle-bd-sec-scan-task.alle-bd-sec-scan@0
  displayName: 'Black Duck Vulnerability Result'
  inputs:
    blackduckconnection: '{ NAME OF BLACK DUCK SERVICE CONNECTION }'
    projectName: ' { NAME OF BLACK DUCK PROJECT NAME (i.e. IT-Allegion-NA-SW-FO-) }'
    versionName: ' { NAME OF BUILD VERSION NAME (i.e. master-CIBuild }'
```

<br>   

### Setup ###   
[Add a custom pipelines task extension](https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops) was used to develop the extension. Some key points:
1. Node 10 is recommended as that is what DevOps currently supports
2. Install the [vss-web-extension](https://github.com/Microsoft/vss-web-extension-sdk) SDK
3. Install ` npm i -g tfx-cli ` to package estension
4. Use ` tfx extension create --manifest-globs vss-extension.json ` to package the extension
5. Upload package/updates to [Marketplace](https://marketplace.visualstudio.com/manage/publishers/producttech)
6. Share package with organization.   

<br>   

### Additional Resources ###   
[Black Duck API](https://allegion.blackducksoftware.com/api-doc/public.html#_overview)   
[Black Duck ADO-Task Repo on Github](https://allegion.blackducksoftware.com/api-doc/public.html#_overview)

<br>

<b>TODO</b>   
- Add a means to exclude certain security violations triggering a failure, even if they are CRITICAL or HIGH  
- Incorporate with Omkar's pipeline reports
- Enhanced configurability of what triggers actions within ADO