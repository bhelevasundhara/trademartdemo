/*
*      @author             Rachana
*      @date               19-10-2023
*      @description        Batch class to update LCSL Taxonomy Change values in existing opportunity split records 
*      Modification Log:
*      ------------------------------------------------------------------------------------
*      Developer                   Date                  Description
*      ------------------------------------------------------------------------------------
*      Rachana 	            	   19-10-2023            US-13167: Initial Version
* 	   Rachana & Renuka 		   20-02-2024			 US-13648: Changes to accomodate bottom up and LCSL Unique Identifier based approach 
*/

public class GCRM_LCSLTaxonomyChangeBatch implements Database.Batchable<SObject>, Database.Stateful {
	public Date  dateToUse;
	public Set<String> lcsl5Modified;
	public Set<String> lcsl6Modified;
	public Set<String> lcslSuccessors;
	public String query = 'SELECT gCRM_Level__c, gCRM_Geography__c, gCRM_Swift_Code__c, gCRM_CSL_Label__c, gCRM_isActive__c, gCRM_Sub_Code__c,'
	+ 'gCRM_Direct_Parent__c, gCRM_Taxonomy_UID__c, gCRM_Parent_Taxonomy_UID__c, gCRM_Successor_Taxonomy_UI__c, gCRM_LCSL_Unique_Identifier__c,'
	+ 'gCRM_Direct_Parent__r.gCRM_Direct_Parent__r.gCRM_Taxonomy_UID__c FROM gCRM_Client_Service_Level_Framework__c ';
	Map<String, gCRM_Client_Service_Level_Framework__c> lcsl5RecordMap = new Map<String, gCRM_Client_Service_Level_Framework__c>();
	Map<String, gCRM_Client_Service_Level_Framework__c> lcsl6RecordMap = new Map<String, gCRM_Client_Service_Level_Framework__c>();
	public GCRM_LCSLTaxonomyChangeBatch() {
		dateToUse = System.today().addDays(-1);
		query += 'WHERE  LastModifiedDate > :dateToUse';
	}
	public GCRM_LCSLTaxonomyChangeBatch(Date inputDate){
		dateToUse = inputDate;
		query += 'WHERE  LastModifiedDate > :dateToUse';
	}

	public GCRM_LCSLTaxonomyChangeBatch(String strWhereClause){
        query += strWhereClause;  
    }


	public Database.QueryLocator start(Database.BatchableContext BC){
		lcsl5Modified = new Set<String>();
		lcsl6Modified = new Set<String>();
		lcslSuccessors = new Set<String>();
		List<gCRM_Client_Service_Level_Framework__c> lstLCSLRecords = Database.query(query);
		//----------------------------- Query LCSL Framework Object for the LCSL which are modified----------------//
		for(gCRM_Client_Service_Level_Framework__c lcslRecord : lstLCSLRecords){
				if(lcslRecord.gCRM_Level__c == 5){
					lcsl5Modified.add(lcslRecord.gCRM_Swift_Code__c);
					lcsl5RecordMap.put(lcslRecord.gCRM_LCSL_Unique_Identifier__c, lcslRecord);
				}
				if(lcslRecord.gCRM_Level__c == 6){
					lcsl6Modified.add(lcslRecord.gCRM_Swift_Code__c);
					lcsl6RecordMap.put(lcslRecord.gCRM_LCSL_Unique_Identifier__c, lcslRecord);
				}
				if(!lcslRecord.gCRM_isActive__c){
					lcslSuccessors.add(lcslRecord.gCRM_Successor_Taxonomy_UI__c);
				}
			}
		//----------------------------- Query LCSL records for successors and parent records for processing----------------/
		for(gCRM_Client_Service_Level_Framework__c lcslRecord : 
			[SELECT gCRM_Level__c, gCRM_Geography__c, gCRM_Swift_Code__c, gCRM_CSL_Label__c, gCRM_isActive__c, gCRM_Sub_Code__c,
			gCRM_Direct_Parent__c,gCRM_Direct_Parent__r.gCRM_CSL_Label__c, gCRM_Direct_Parent__r.gCRM_Taxonomy_UID__c,gCRM_Direct_Parent__r.gCRM_Swift_Code__c,
			gCRM_Direct_Parent__r.gCRM_Direct_Parent__r.gCRM_Taxonomy_UID__c, gCRM_Direct_Parent__r.gCRM_Direct_Parent__r.gCRM_Level__c, 
			gCRM_Taxonomy_UID__c, gCRM_Parent_Taxonomy_UID__c, gCRM_Successor_Taxonomy_UI__c, gCRM_LCSL_Unique_Identifier__c
			FROM gCRM_Client_Service_Level_Framework__c where gCRM_Taxonomy_UID__c in :lcslSuccessors]){
				if(lcslRecord.gCRM_Level__c == 5){
					lcsl5RecordMap.put(lcslRecord.gCRM_Geography__c + '~' + lcslRecord.gCRM_Taxonomy_UID__c, lcslRecord);
				}
				if(lcslRecord.gCRM_Level__c == 6){
					lcsl6RecordMap.put(lcslRecord.gCRM_Geography__c + '~' + lcslRecord.gCRM_Taxonomy_UID__c, lcslRecord);
				}
		}
        system.debug('LCSL Record Maps 5 '+lcsl5RecordMap);
        system.debug('LCSL Record Maps 6 '+lcsl6RecordMap);
		
		//----------------------------- Query Split Records that have LCSL 5 OR 6 which is modified in Framework Object ----------------//
		String query = 'SELECT Id,gCRM_Local_Client_Service_Level_5__c,gCRM_Local_Client_Service_Level_5_Code__c,gCRM_Local_Client_Service_Level_6__c,gCRM_Local_Client_Service_Level_6_Code__c,';
		query += 'gCRM_SWIFT_Level_5_Code__c,gCRM_SWIFT_Level_6_Code__c,gCRM_Opportunity__r.Id,gCRM_Opportunity__r.StageName,gCRM_Country__c,gCRM_Client_Service_Level_4__c,';
		query += ' gCRM_Client_Service_Level_3__c, gCRM_Client_Service_Level_2__c';
		query += ' FROM gCRM_Opportunity_Split__c';
		query += ' WHERE gCRM_Opportunity__r.StageName != \'Closed Won\' AND gCRM_Opportunity__r.StageName  != \'Closed Lost\'';
		query += ' AND gCRM_Opportunity__r.StageName != \'Closed Abandoned\'';
		query += ' AND (gCRM_SWIFT_Level_5_Code__c IN :lcsl5Modified';
		query += ' OR gCRM_SWIFT_Level_6_Code__c IN :lcsl6Modified)';
		return Database.getQueryLocator(query);
	}
	public void execute(Database.BatchableContext BC, List<gCRM_Opportunity_Split__c> records){
		try{
			List<gCRM_Opportunity_Split__c> splitRecordsToUpdate = new List<gCRM_Opportunity_Split__c>{};
			String lcsl6Label;
			String lcsl6SwiftCode;
			String lcsl6SuccessorCode;
            String lcsl5Label;
            String lcsl5SuccessorCode;
            String lcsl5SwiftCode;
			for(gCRM_Opportunity_Split__c oppSplitRecord : records){
				Boolean skipLCSL5Processing = false;

				//----------------------------- Collect label, TaxoId, Swift code in variables----------------/

				String splitLCSL5Code = oppSplitRecord.gCRM_Country__c + '~' +oppSplitRecord.gCRM_SWIFT_Level_5_Code__c;
				String splitLCSL6Code = oppSplitRecord.gCRM_Country__c + '~' +oppSplitRecord.gCRM_SWIFT_Level_6_Code__c;
				if(lcsl5RecordMap.containsKey(splitLCSL5Code)){
                    lcsl5Label = lcsl5RecordMap.get(splitLCSL5Code).gCRM_CSL_Label__c;
                    lcsl5SuccessorCode = lcsl5RecordMap.get(splitLCSL5Code).gCRM_Successor_Taxonomy_UI__c;
                    lcsl5SwiftCode = lcsl5RecordMap.get(splitLCSL5Code).gCRM_Swift_Code__c;
                }
				if(lcsl6RecordMap.containsKey(splitLCSL6Code)){
					lcsl6Label = lcsl6RecordMap.get(splitLCSL6Code).gCRM_CSL_Label__c;
					lcsl6SwiftCode = lcsl6RecordMap.get(splitLCSL6Code).gCRM_Swift_Code__c;
					lcsl6SuccessorCode = lcsl6RecordMap.get(splitLCSL6Code).gCRM_Successor_Taxonomy_UI__c;
				}

				//----------- Split Lcsl 6 Updates  :  If record is active then its a label change else replace it with successor details------------------//
				if(lcsl6RecordMap.containsKey(splitLCSL6Code)){
					if(lcsl6RecordMap.get(splitLCSL6Code).gCRM_isActive__c){
						oppSplitRecord.gCRM_Local_Client_Service_Level_6__c = lcsl6Label;
					}else{
							if(lcsl6RecordMap.containsKey(oppSplitRecord.gCRM_Country__c + '~' +lcsl6SuccessorCode)){
							skipLCSL5Processing = true;
							gCRM_Client_Service_Level_Framework__c lcslSuccessorRecord = lcsl6RecordMap.get(oppSplitRecord.gCRM_Country__c + '~' +lcsl6SuccessorCode);

							//---------------- If Global CSLs of the successor is different from the Global CSL of inactive, clear out LCSLs------------//
							Boolean hasGlobalParentCSLChanged = lcslSuccessorRecord.gCRM_Direct_Parent__r.gCRM_Direct_Parent__r.gCRM_Taxonomy_UID__c != lcsl6RecordMap.get(splitLCSL6Code).gCRM_Direct_Parent__r.gCRM_Direct_Parent__r.gCRM_Taxonomy_UID__c;
							if(hasGlobalParentCSLChanged){
								oppSplitRecord.gCRM_Local_Client_Service_Level_6__c = oppSplitRecord.gCRM_SWIFT_Level_6_Code__c = oppSplitRecord.gCRM_Local_Client_Service_Level_6_Code__c = null ; 
								oppSplitRecord.gCRM_Local_Client_Service_Level_5__c = oppSplitRecord.gCRM_SWIFT_Level_5_Code__c = oppSplitRecord.gCRM_Local_Client_Service_Level_5_Code__c = null;
							}
							else{
								oppSplitRecord.gCRM_Local_Client_Service_Level_6__c =  lcslSuccessorRecord.gCRM_CSL_Label__c;
								oppSplitRecord.gCRM_SWIFT_Level_6_Code__c =  lcslSuccessorRecord.gCRM_Swift_Code__c;
								oppSplitRecord.gCRM_Local_Client_Service_Level_6_Code__c = lcslSuccessorRecord.gCRM_Taxonomy_UID__c;
								
								oppSplitRecord.gCRM_Local_Client_Service_Level_5__c =  lcslSuccessorRecord.gCRM_Direct_Parent__r.gCRM_CSL_Label__c;
								oppSplitRecord.gCRM_SWIFT_Level_5_Code__c =  lcslSuccessorRecord.gCRM_Direct_Parent__r.gCRM_Swift_Code__c;
								oppSplitRecord.gCRM_Local_Client_Service_Level_5_Code__c = lcslSuccessorRecord.gCRM_Direct_Parent__r.gCRM_Taxonomy_UID__c;
							}
							system.debug('SUCCESSOR REC '+lcslSuccessorRecord);
							system.debug('SUCCESSOR REC '+oppSplitRecord.gCRM_Country__c + '~' +lcsl6SuccessorCode);
         					}
							else{
								oppSplitRecord.gCRM_Local_Client_Service_Level_6__c = oppSplitRecord.gCRM_SWIFT_Level_6_Code__c = oppSplitRecord.gCRM_Local_Client_Service_Level_6_Code__c = null ;
							}
						}
				}

				//----------- Split Lcsl 5 Updates  :  If record is active then its a label change else replace it with successor details-------------------//
				if(lcsl5RecordMap.containsKey(splitLCSL5Code) && !skipLCSL5Processing){
					if(lcsl5RecordMap.get(splitLCSL5Code).gCRM_isActive__c){
						oppSplitRecord.gCRM_Local_Client_Service_Level_5__c = lcsl5Label;
					}
					else{
						if(lcsl5RecordMap.containsKey(oppSplitRecord.gCRM_Country__c + '~' +lcsl5SuccessorCode)){
							gCRM_Client_Service_Level_Framework__c lcslSuccessorRecord = lcsl5RecordMap.get(oppSplitRecord.gCRM_Country__c + '~' +lcsl5SuccessorCode);
							
							//---------------- If Global CSLs of the successor is different from the Global CSL of inactive, clear out LCSLs------------//
							Boolean hasGlobalParentCSLChanged = lcslSuccessorRecord.gCRM_Direct_Parent__r.gCRM_Taxonomy_UID__c != lcsl5RecordMap.get(splitLCSL5Code).gCRM_Direct_Parent__r.gCRM_Taxonomy_UID__c;
							if(hasGlobalParentCSLChanged){
								oppSplitRecord.gCRM_Local_Client_Service_Level_5__c = oppSplitRecord.gCRM_SWIFT_Level_5_Code__c = oppSplitRecord.gCRM_Local_Client_Service_Level_5_Code__c = null;
							}
							else{
								oppSplitRecord.gCRM_Local_Client_Service_Level_5__c =  lcslSuccessorRecord.gCRM_CSL_Label__c;
								oppSplitRecord.gCRM_SWIFT_Level_5_Code__c =  lcslSuccessorRecord.gCRM_Swift_Code__c;
								oppSplitRecord.gCRM_Local_Client_Service_Level_5_Code__c = lcslSuccessorRecord.gCRM_Taxonomy_UID__c;
							 }
						}
						else{
							oppSplitRecord.gCRM_Local_Client_Service_Level_5__c = oppSplitRecord.gCRM_SWIFT_Level_5_Code__c = oppSplitRecord.gCRM_Local_Client_Service_Level_5_Code__c = null;
						}
					}		
				}
				splitRecordsToUpdate.add(oppSplitRecord);
			}
			if(!splitRecordsToUpdate.isEmpty()) {
				Database.SaveResult[] results =  Database.update(splitRecordsToUpdate,false);
				GCRM_ExceptionLogger.logDMLErrors(results, 'GCRM_LCSLTaxonomyChangeBatch', null);
            	//GCRM_ErrorLog.logMultipleErrors(results, 'gCRM_Opportunity_Split__c', 'Jupiter', 'GCRM_LCSLTaxonomyChangeBatch');
			}
		}catch(Exception ex){
			GCRM_ExceptionLogger.logException(ex, 'GCRM_LCSLTaxonomyChangeBatch', null);
			//GCRM_ErrorLog.getErrorLogDetails(ex,'GCRM_LCSLTaxonomyChangeBatch',null,'Jupiter');
		}
	}
	public void finish(Database.BatchableContext BC){
	}
	
}