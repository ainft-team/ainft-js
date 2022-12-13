How to create AINFT app
- 

## 1. Create access key

AccessKey is the unique key of the app to be created. You must have the access key to use the APIs of the AINFT server.  
```bash
$ node create-acccess-key.js

# AccessKey: fee5faf3b9ea01a82aff48bda3e0b190ea74a33b694de8416bf5ae6b0fd8ad72
# Account information
# {
#  address: '0x9e0538f1C63785cB1d83dc97eF00634290fEe237',
#  private_key: 'fee5faf3b9ea01a82aff48bda3e0b190ea74a33b694de8416bf5ae6b0fd8ad72',
#   public_key: '30ce7a962b7b7f62c05841c7121a27cdf9be658003754f620c4c0994af8aa73484e5c083abb016140be657ed8d76b6ac4f21dcabb51334f519dbdb2239b23f68'
# }
```

## 2. Create app
You can create an app using the access key created above, the appId you want, and the userId where you will use ainft-js.  
- STAGE: DEV or PROD. DEV means ainft server's developments environments and ain blockchain testnet. PROD means ainft server's production environments and ain blockchain mainnet.
- APP ID: This is the app id to create on the ainft server. Combinations of lowercase letters, underscores and number are allowed.
- USER ID: This is the user id used in the ainft server. Become the owner of the app. It is recommended to use the userId of the place where ainft-js is used.
- AccessKey: It means ain blockchain private key. You must have the access key to use the APIs of the AINFT server.

```bash
# node create-ainft-server-.app.js <STAGE> <APP ID> <USER ID> <ACCESS KEY>

$ node create-ainft-server-app.js DEV new_app myUserId fee5faf3b9ea01a82aff48bda3e0b190ea74a33b694de8416bf5ae6b0fd8ad72

# Starting app initialization... This may take up to a minute.
# create app tx hash - 0x3fc82d3c8e65e21c30cfad3d0d8a728a24a2e2f608dd7cad8447af7b672c8988
# stake tx hash - 0x8280bf50405f925c8a230523339bb67d44ed3c74b5561dacbc6faec662d7a6e6
# set rule tx hash - 0xe813819ceed6563d4171a146ec12910cf67d505bb7d47e346950ab82cf0dc0a4

# The app has been created successfully.
```

If you want to see transaction, go to insight and search it.
- https://testnet-insight.ainetwork.ai
- https://insight.ainetwork.ai

