package com.jonathan;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.InvalidPropertiesFormatException;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.junit.Before;
import org.junit.After;
import static org.junit.Assert.assertTrue;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.chrome.ChromeDriver;

import com.eclipsesource.json.JsonObject;
import com.jonathan.pages.JonathanHomePage;

import helpers.Properties;
import io.github.bonigarcia.wdm.WebDriverManager;

public class JonathanTestBase {
	protected WebDriver driver = null;
	protected Properties properties = new Properties();
	protected JsonObject jProp;
	protected JonathanHomePage jHomePage;	
	
	@Before
	public void setupPhase1()  throws InvalidPropertiesFormatException, FileNotFoundException, IOException
	{
		/*Load Properties*/
		String projectDir = System.getProperty("user.dir");
		String configFile = projectDir + "/src/test/resources/config.json";
		jProp = properties.loadFromJSon(configFile);
		
		boolean propertiesLoaded = false;
		if(jProp != null)
			propertiesLoaded = true;
		
		assertTrue("There was a problem while loading properties.", propertiesLoaded);
	}
	
	protected void setUpPhase2(String browser, String url) 
	{
		/*Driver setup*/
		assertTrue("There was a problem with driver initialization", driverSetup(browser));
		
		/*Open URL*/
		assertTrue("There was a problem opening the URL", openUrl(url));
		
		/*Pages setup*/
		jHomePage = new JonathanHomePage(driver);
	}
	
	private boolean driverSetup(String browser)
	{
		switch (browser){
		case "Chrome":
			WebDriverManager.chromedriver().setup();
			
			ChromeOptions chromeOptions = new ChromeOptions();
			List<String> arguments = new ArrayList<String>();
			arguments.add("--disable-notifications");
			arguments.add("--headless");
			arguments.add("--no-sandbox");
			
			chromeOptions.addArguments(arguments);
			driver = new ChromeDriver(chromeOptions);
		    break;
		case "Firefox":
			return false;
		default:
			System.out.println("Driver cannot be initialized");
			driver = null;
			return false;		
	}
	driver.manage().timeouts().implicitlyWait(15, TimeUnit.SECONDS);
	driver.manage().window().maximize();
	return true;
	}
	
	private boolean openUrl (String url) 
	{
		if (driver != null) {			
			if (!url.isEmpty()) {
				driver.get(url);
				return true;
			}else {
				System.out.println("URL cannot be empty");
				return false;			
			}
		}else {
			System.out.println("Driver is not initialized");
			return false;
		}
	}
	
	@After
	public void tearDown() {
		if (driver != null) {
			driver.quit();
		}		
	}

}
