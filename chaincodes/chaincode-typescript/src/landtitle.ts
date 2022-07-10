/* eslint-disable new-cap */
/* eslint-disable max-len */
import {Object, Property} from 'fabric-contract-api';


@Object()
export class LandTitle {
    @Property()
	public docType!: string;

    // This has to be a composite key of the

    @Property()
    public landTitleId!: string;

    // location details
    // more information about maps and sketchs can be found ithe IPFS to be included in the system
    
    @Property()
    public province!: string;
    @Property()
    public district!: string;
    @Property()
    public town!: string; // in cases of farms and villages this portion is left empty
    // in cases of farms and villages this portion is left empty

    // Land details
    // Land details

    // public LandParcel!: string;
    @Property()
    public sizeInSquareMetres!: string;
    @Property()
    public landUse!: string;
    // Land Ownership
    // Land Ownership
    @Property()
    public owner!: string;
    @Property()
    public ownerIdNumber!: string;
    // Land transfer fields
    // Land transfer fields
    @Property()
    public transferToName!: string;
    @Property()
    public transferToID!: string;
    @Property()
    public tradingStatus!: string;

    @Property()
    public appraisedValue!: string;

    @Property()
    public dateOfTitleIssue!: string;

    @Property()
    public txId!: string;
    @Property()
    public identityOfCreator!: string;

    @Property()
    public	dateOfEditing!: string;
    @Property()
    public ownerEmail!: string;
    @Property()
    public hashOfIpfsDocs!: string;

    @Property()
    public transferToEmail!: string;
}



