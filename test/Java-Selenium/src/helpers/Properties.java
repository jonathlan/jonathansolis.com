package helpers;

import java.io.FileNotFoundException;
import java.io.IOException;

import com.eclipsesource.json.Json;
import com.eclipsesource.json.JsonObject;
import com.eclipsesource.json.ParseException;

public class Properties {
	/**
	   * Loads a JSON object from the given file.
	   *
	   * @param file
	   *          the location to the file as a String
	   * @return the JSON object that has been loaded
	   * @throws FileNotFoundException
	   *           if the file cannot be located
	   * @throws IOException
	   *           if an I/O error occurs in the reader
	   * @throws ParseException
	   *           if the input is not valid JSON
	   * @throws UnsupportedOperationException
	   *           if the input does not contain a JSON object	   * 
	   */
	public JsonObject loadFromJSon(String file) {
		//TODO Find JSon.simple
		//TODO log from the application		
		
		try {
			
			java.io.FileReader rFile = new java.io.FileReader(file);			
			JsonObject jObject = Json.parse(rFile).asObject();
			return jObject;
			
		}catch (FileNotFoundException e) {
			e.printStackTrace();
		}catch (IOException e) {
			e.printStackTrace();
		}catch (ParseException e) {
			e.printStackTrace();
		}catch (UnsupportedOperationException e) {
			e.printStackTrace();
		}
		return null;	      
	}
}
