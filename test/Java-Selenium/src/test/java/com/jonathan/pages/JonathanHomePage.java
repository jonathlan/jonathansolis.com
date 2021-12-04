package com.jonathan.pages;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;


public class JonathanHomePage {
	WebDriver driver;
	WebDriverWait wait;
	
	public JonathanHomePage(WebDriver driver) 
	{
		this.driver = driver;
		PageFactory.initElements(this.driver, this);
		wait = new WebDriverWait(driver, 15);
	}
	
	// Elements
	@FindBy(how = How.XPATH, using = "//")
	WebElement photo;
	
	@FindBy (how = How.XPATH, using = "//a[@href='https://jonathansolis.com/blog/']/i[@class='fab fa-wordpress']")
	WebElement blogIcon;
	
	@FindBy(how = How.XPATH, using = "//p[@class='icons']")
	WebElement icons;
	
	// Methods
	public boolean fotoFound()
	{
		wait.until(ExpectedConditions.
				visibilityOfElementLocated(By.xpath("//html/body/div[1]/div/div[1]/img")));		
		return true;
	}
	
	public boolean blogIconURL()
	{
		wait.until(ExpectedConditions.visibilityOf(blogIcon));
		if(blogIcon.isEnabled())
			return true;
		return false;
	}
	
	public boolean validTitle(String expectedTitle)
	{
		String actualTitle = driver.getTitle();
		if (actualTitle.equalsIgnoreCase(expectedTitle))
			return true;
		else
			return false;
	}
	
	/**
	 * Validates that home page has the expected number of icons.
	 * @param numOfIcons The expected number of icons
	 * @return
	 * A boolean true if the number of icons in the homepage corresponds to numOfIcons,
	 *  false otherwise.
	 */
	public boolean hasEnoughIcons(int numOfIcons) {
		List<WebElement> actualIcons = 
				icons.findElements(By.xpath("./a/i"));
		
		if(actualIcons.size() == numOfIcons)
			return true;
		else
			return false;
	}

}
