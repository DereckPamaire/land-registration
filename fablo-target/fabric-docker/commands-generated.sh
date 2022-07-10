#!/usr/bin/env bash

generateArtifacts() {
  printHeadline "Generating basic configs" "U1F913"

  printItalics "Generating crypto material for Orderer" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-orderer.yaml" "peerOrganizations/landreg.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for Registrar" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-registrar.yaml" "peerOrganizations/land.registrar.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for Realtor" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-realtor.yaml" "peerOrganizations/land.realtor.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for Bank" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-bank.yaml" "peerOrganizations/land.bank.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for PublicAccess" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-publicaccess.yaml" "peerOrganizations/land.publicaccess.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating genesis block for group landreg" "U1F3E0"
  genesisBlockCreate "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config" "LandregGenesis"

  # Create directory for chaincode packages to avoid permission errors on linux
  mkdir -p "$FABLO_NETWORK_ROOT/fabric-config/chaincode-packages"
}

startNetwork() {
  printHeadline "Starting network" "U1F680"
  (cd "$FABLO_NETWORK_ROOT"/fabric-docker && docker-compose up -d)
  sleep 4
}

generateChannelsArtifacts() {
  printHeadline "Generating config for 'channel01'" "U1F913"
  createChannelTx "channel01" "$FABLO_NETWORK_ROOT/fabric-config" "Channel01" "$FABLO_NETWORK_ROOT/fabric-config/config"
}

installChannels() {
  printHeadline "Creating 'channel01' on Registrar/peer0" "U1F63B"
  docker exec -i cli.land.registrar.com bash -c "source scripts/channel_fns.sh; createChannelAndJoinTls 'channel01' 'RegistrarMSP' 'peer0.land.registrar.com:7041' 'crypto/users/Admin@land.registrar.com/msp' 'crypto/users/Admin@land.registrar.com/tls' 'crypto-orderer/tlsca.landreg.com-cert.pem' 'orderer0.landreg.landreg.com:7030';"

  printItalics "Joining 'channel01' on  Realtor/peer0" "U1F638"
  docker exec -i cli.land.realtor.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'channel01' 'RealtorMSP' 'peer0.land.realtor.com:7061' 'crypto/users/Admin@land.realtor.com/msp' 'crypto/users/Admin@land.realtor.com/tls' 'crypto-orderer/tlsca.landreg.com-cert.pem' 'orderer0.landreg.landreg.com:7030';"
  printItalics "Joining 'channel01' on  Bank/peer0" "U1F638"
  docker exec -i cli.land.bank.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'channel01' 'BankMSP' 'peer0.land.bank.com:7081' 'crypto/users/Admin@land.bank.com/msp' 'crypto/users/Admin@land.bank.com/tls' 'crypto-orderer/tlsca.landreg.com-cert.pem' 'orderer0.landreg.landreg.com:7030';"
  printItalics "Joining 'channel01' on  PublicAccess/peer0" "U1F638"
  docker exec -i cli.land.publicaccess.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoinTls 'channel01' 'PublicAccessMSP' 'peer0.land.publicaccess.com:7101' 'crypto/users/Admin@land.publicaccess.com/msp' 'crypto/users/Admin@land.publicaccess.com/tls' 'crypto-orderer/tlsca.landreg.com-cert.pem' 'orderer0.landreg.landreg.com:7030';"
}

installChaincodes() {
  if [ -n "$(ls "$CHAINCODES_BASE_DIR/chaincodes/chaincode-typescript")" ]; then
    local version="1.0.0"
    printHeadline "Packaging chaincode 'chaincode-typescript'" "U1F60E"
    chaincodeBuild "chaincode-typescript" "node" "$CHAINCODES_BASE_DIR/chaincodes/chaincode-typescript"
    chaincodePackage "cli.land.registrar.com" "peer0.land.registrar.com:7041" "chaincode-typescript" "$version" "node" printHeadline "Installing 'chaincode-typescript' for Registrar" "U1F60E"
    chaincodeInstall "cli.land.registrar.com" "peer0.land.registrar.com:7041" "chaincode-typescript" "$version" "crypto-orderer/tlsca.landreg.com-cert.pem"
    chaincodeApprove "cli.land.registrar.com" "peer0.land.registrar.com:7041" "channel01" "chaincode-typescript" "$version" "orderer0.landreg.landreg.com:7030" "AND('RegistrarMSP.member','RealtorMSP.member','BankMSP.member')" "false" "crypto-orderer/tlsca.landreg.com-cert.pem" ""
    printHeadline "Installing 'chaincode-typescript' for Realtor" "U1F60E"
    chaincodeInstall "cli.land.realtor.com" "peer0.land.realtor.com:7061" "chaincode-typescript" "$version" "crypto-orderer/tlsca.landreg.com-cert.pem"
    chaincodeApprove "cli.land.realtor.com" "peer0.land.realtor.com:7061" "channel01" "chaincode-typescript" "$version" "orderer0.landreg.landreg.com:7030" "AND('RegistrarMSP.member','RealtorMSP.member','BankMSP.member')" "false" "crypto-orderer/tlsca.landreg.com-cert.pem" ""
    printHeadline "Installing 'chaincode-typescript' for Bank" "U1F60E"
    chaincodeInstall "cli.land.bank.com" "peer0.land.bank.com:7081" "chaincode-typescript" "$version" "crypto-orderer/tlsca.landreg.com-cert.pem"
    chaincodeApprove "cli.land.bank.com" "peer0.land.bank.com:7081" "channel01" "chaincode-typescript" "$version" "orderer0.landreg.landreg.com:7030" "AND('RegistrarMSP.member','RealtorMSP.member','BankMSP.member')" "false" "crypto-orderer/tlsca.landreg.com-cert.pem" ""
    printHeadline "Installing 'chaincode-typescript' for PublicAccess" "U1F60E"
    chaincodeInstall "cli.land.publicaccess.com" "peer0.land.publicaccess.com:7101" "chaincode-typescript" "$version" "crypto-orderer/tlsca.landreg.com-cert.pem"
    chaincodeApprove "cli.land.publicaccess.com" "peer0.land.publicaccess.com:7101" "channel01" "chaincode-typescript" "$version" "orderer0.landreg.landreg.com:7030" "AND('RegistrarMSP.member','RealtorMSP.member','BankMSP.member')" "false" "crypto-orderer/tlsca.landreg.com-cert.pem" ""
    printItalics "Committing chaincode 'chaincode-typescript' on channel 'channel01' as 'Registrar'" "U1F618"
    chaincodeCommit "cli.land.registrar.com" "peer0.land.registrar.com:7041" "channel01" "chaincode-typescript" "$version" "orderer0.landreg.landreg.com:7030" "AND('RegistrarMSP.member','RealtorMSP.member','BankMSP.member')" "false" "crypto-orderer/tlsca.landreg.com-cert.pem" "peer0.land.registrar.com:7041,peer0.land.realtor.com:7061,peer0.land.bank.com:7081,peer0.land.publicaccess.com:7101" "crypto-peer/peer0.land.registrar.com/tls/ca.crt,crypto-peer/peer0.land.realtor.com/tls/ca.crt,crypto-peer/peer0.land.bank.com/tls/ca.crt,crypto-peer/peer0.land.publicaccess.com/tls/ca.crt" ""
  else
    echo "Warning! Skipping chaincode 'chaincode-typescript' installation. Chaincode directory is empty."
    echo "Looked in dir: '$CHAINCODES_BASE_DIR/chaincodes/chaincode-typescript'"
  fi

}

notifyOrgsAboutChannels() {
  printHeadline "Creating new channel config blocks" "U1F537"
  createNewChannelUpdateTx "channel01" "RegistrarMSP" "Channel01" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "channel01" "RealtorMSP" "Channel01" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "channel01" "BankMSP" "Channel01" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "channel01" "PublicAccessMSP" "Channel01" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"

  printHeadline "Notyfing orgs about channels" "U1F4E2"
  notifyOrgAboutNewChannelTls "channel01" "RegistrarMSP" "cli.land.registrar.com" "peer0.land.registrar.com" "orderer0.landreg.landreg.com:7030" "crypto-orderer/tlsca.landreg.com-cert.pem"
  notifyOrgAboutNewChannelTls "channel01" "RealtorMSP" "cli.land.realtor.com" "peer0.land.realtor.com" "orderer0.landreg.landreg.com:7030" "crypto-orderer/tlsca.landreg.com-cert.pem"
  notifyOrgAboutNewChannelTls "channel01" "BankMSP" "cli.land.bank.com" "peer0.land.bank.com" "orderer0.landreg.landreg.com:7030" "crypto-orderer/tlsca.landreg.com-cert.pem"
  notifyOrgAboutNewChannelTls "channel01" "PublicAccessMSP" "cli.land.publicaccess.com" "peer0.land.publicaccess.com" "orderer0.landreg.landreg.com:7030" "crypto-orderer/tlsca.landreg.com-cert.pem"

  printHeadline "Deleting new channel config blocks" "U1F52A"
  deleteNewChannelUpdateTx "channel01" "RegistrarMSP" "cli.land.registrar.com"
  deleteNewChannelUpdateTx "channel01" "RealtorMSP" "cli.land.realtor.com"
  deleteNewChannelUpdateTx "channel01" "BankMSP" "cli.land.bank.com"
  deleteNewChannelUpdateTx "channel01" "PublicAccessMSP" "cli.land.publicaccess.com"
}

upgradeChaincode() {
  local chaincodeName="$1"
  if [ -z "$chaincodeName" ]; then
    echo "Error: chaincode name is not provided"
    exit 1
  fi

  local version="$2"
  if [ -z "$version" ]; then
    echo "Error: chaincode version is not provided"
    exit 1
  fi

  if [ "$chaincodeName" = "chaincode-typescript" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/chaincodes/chaincode-typescript")" ]; then
      printHeadline "Packaging chaincode 'chaincode-typescript'" "U1F60E"
      chaincodeBuild "chaincode-typescript" "node" "$CHAINCODES_BASE_DIR/chaincodes/chaincode-typescript"
      chaincodePackage "cli.land.registrar.com" "peer0.land.registrar.com:7041" "chaincode-typescript" "$version" "node" printHeadline "Installing 'chaincode-typescript' for Registrar" "U1F60E"
      chaincodeInstall "cli.land.registrar.com" "peer0.land.registrar.com:7041" "chaincode-typescript" "$version" "crypto-orderer/tlsca.landreg.com-cert.pem"
      chaincodeApprove "cli.land.registrar.com" "peer0.land.registrar.com:7041" "channel01" "chaincode-typescript" "$version" "orderer0.landreg.landreg.com:7030" "AND('RegistrarMSP.member','RealtorMSP.member','BankMSP.member')" "false" "crypto-orderer/tlsca.landreg.com-cert.pem" ""
      printHeadline "Installing 'chaincode-typescript' for Realtor" "U1F60E"
      chaincodeInstall "cli.land.realtor.com" "peer0.land.realtor.com:7061" "chaincode-typescript" "$version" "crypto-orderer/tlsca.landreg.com-cert.pem"
      chaincodeApprove "cli.land.realtor.com" "peer0.land.realtor.com:7061" "channel01" "chaincode-typescript" "$version" "orderer0.landreg.landreg.com:7030" "AND('RegistrarMSP.member','RealtorMSP.member','BankMSP.member')" "false" "crypto-orderer/tlsca.landreg.com-cert.pem" ""
      printHeadline "Installing 'chaincode-typescript' for Bank" "U1F60E"
      chaincodeInstall "cli.land.bank.com" "peer0.land.bank.com:7081" "chaincode-typescript" "$version" "crypto-orderer/tlsca.landreg.com-cert.pem"
      chaincodeApprove "cli.land.bank.com" "peer0.land.bank.com:7081" "channel01" "chaincode-typescript" "$version" "orderer0.landreg.landreg.com:7030" "AND('RegistrarMSP.member','RealtorMSP.member','BankMSP.member')" "false" "crypto-orderer/tlsca.landreg.com-cert.pem" ""
      printHeadline "Installing 'chaincode-typescript' for PublicAccess" "U1F60E"
      chaincodeInstall "cli.land.publicaccess.com" "peer0.land.publicaccess.com:7101" "chaincode-typescript" "$version" "crypto-orderer/tlsca.landreg.com-cert.pem"
      chaincodeApprove "cli.land.publicaccess.com" "peer0.land.publicaccess.com:7101" "channel01" "chaincode-typescript" "$version" "orderer0.landreg.landreg.com:7030" "AND('RegistrarMSP.member','RealtorMSP.member','BankMSP.member')" "false" "crypto-orderer/tlsca.landreg.com-cert.pem" ""
      printItalics "Committing chaincode 'chaincode-typescript' on channel 'channel01' as 'Registrar'" "U1F618"
      chaincodeCommit "cli.land.registrar.com" "peer0.land.registrar.com:7041" "channel01" "chaincode-typescript" "$version" "orderer0.landreg.landreg.com:7030" "AND('RegistrarMSP.member','RealtorMSP.member','BankMSP.member')" "false" "crypto-orderer/tlsca.landreg.com-cert.pem" "peer0.land.registrar.com:7041,peer0.land.realtor.com:7061,peer0.land.bank.com:7081,peer0.land.publicaccess.com:7101" "crypto-peer/peer0.land.registrar.com/tls/ca.crt,crypto-peer/peer0.land.realtor.com/tls/ca.crt,crypto-peer/peer0.land.bank.com/tls/ca.crt,crypto-peer/peer0.land.publicaccess.com/tls/ca.crt" ""

    else
      echo "Warning! Skipping chaincode 'chaincode-typescript' upgrade. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/chaincodes/chaincode-typescript'"
    fi
  fi
}

stopNetwork() {
  printHeadline "Stopping network" "U1F68F"
  (cd "$FABLO_NETWORK_ROOT"/fabric-docker && docker-compose stop)
  sleep 4
}

networkDown() {
  printHeadline "Destroying network" "U1F916"
  (cd "$FABLO_NETWORK_ROOT"/fabric-docker && docker-compose down)

  printf "\nRemoving chaincode containers & images... \U1F5D1 \n"
  docker rm -f $(docker ps -a | grep dev-peer0.land.registrar.com-chaincode-typescript-1.0.0-* | awk '{print $1}') || echo "docker rm failed, Check if all fabric dockers properly was deleted"
  docker rmi $(docker images dev-peer0.land.registrar.com-chaincode-typescript-1.0.0-* -q) || echo "docker rm failed, Check if all fabric dockers properly was deleted"
  docker rm -f $(docker ps -a | grep dev-peer0.land.realtor.com-chaincode-typescript-1.0.0-* | awk '{print $1}') || echo "docker rm failed, Check if all fabric dockers properly was deleted"
  docker rmi $(docker images dev-peer0.land.realtor.com-chaincode-typescript-1.0.0-* -q) || echo "docker rm failed, Check if all fabric dockers properly was deleted"
  docker rm -f $(docker ps -a | grep dev-peer0.land.bank.com-chaincode-typescript-1.0.0-* | awk '{print $1}') || echo "docker rm failed, Check if all fabric dockers properly was deleted"
  docker rmi $(docker images dev-peer0.land.bank.com-chaincode-typescript-1.0.0-* -q) || echo "docker rm failed, Check if all fabric dockers properly was deleted"
  docker rm -f $(docker ps -a | grep dev-peer0.land.publicaccess.com-chaincode-typescript-1.0.0-* | awk '{print $1}') || echo "docker rm failed, Check if all fabric dockers properly was deleted"
  docker rmi $(docker images dev-peer0.land.publicaccess.com-chaincode-typescript-1.0.0-* -q) || echo "docker rm failed, Check if all fabric dockers properly was deleted"

  printf "\nRemoving generated configs... \U1F5D1 \n"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/config"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/crypto-config"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/chaincode-packages"

  printHeadline "Done! Network was purged" "U1F5D1"
}
